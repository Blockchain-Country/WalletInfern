const BTC_PROVIDER_URL = "https://api.blockcypher.com/v1/btc";
const NETWORK_TEST = 'test3';
const API_TOKEN = process.env.BLOCKCYPHER_API_TOKEN;
const SEND = "SEND";
const BALANCE = "BALANCE";
const FEE = "FEE";
const GET_UTXO = "GET_UTXO";
const PROBLEM_WITH_NODE = "PROBLEM_WITH_NODE";
const WRONG_FEE = "WRONG FEE";
const TXSIZE = 0.512;

class BlockCypherProvider {
    constructor(app, validator, converter) {
        this.httpService = app.httpService;
        this.validator = validator;
        this.converter = converter;
    }

    _getProviderUrl() {
        return BTC_PROVIDER_URL;
    }

    _getNetworkUrl() {
        return NETWORK_TEST;
    }

    urlCompose(action, parameters) {
        let base = `${this._getProviderUrl()}/${this._getNetworkUrl()}`;
        let relativeUrl = ''
        switch (action) {
            case BALANCE:
                this.validator.validateObject(parameters, "urlCompose.parameters");
                var address = parameters["address"];
                this.validator.validateAddress(address);
                relativeUrl = `/addrs/${address}/balance?1`;
                break;
            case SEND:
                relativeUrl = `/txs/push?1`;
                break;
            case FEE:
                relativeUrl = `?1`;
                break;
            case GET_UTXO:
                this.validator.validateObject(parameters, "urlCompose.parameters");
                var address = parameters["address"];
                this.validator.validateAddress(address);
                relativeUrl = `/addrs/${address}?unspentOnly=true`;
                break;
        }
        let url = `${base}${relativeUrl}&token=${API_TOKEN}`;
        console.log(action, url);
        return url;
    }

    getBalance(address) {
        return new Promise(async (resolve, reject) => {
            try {
                let url = this.urlCompose(BALANCE, {"address": address});
                let result = await this.getRequest(url);
                let balance = result["final_balance"];
                return resolve(balance);
            } catch (e) {
                return reject(e);
            }
        })
    }

    getFee() {
        return new Promise(async (resolve, reject) => {
            try {
                let url = this.urlCompose(FEE);
                let result = await this.getRequest(url);
                let medium = TXSIZE * this.converter.toDecimals(result.medium_fee_per_kb);
                return resolve(medium);
            } catch (e) {
                return reject(e)
            }
        })
    }

    addSignedUtxos(keyring, txb, from, to, amount, fee) {
        return new Promise(async (resolve, reject) => {
            try {
                this.validator.validateObject(keyring, "keyring");
                this.validator.validateObject(txb, "txb");
                let utxoData = await this.getUtxos(from, amount, fee);
                if (utxoData !== WRONG_FEE) {
                    let utxos = utxoData.outputs;
                    let change = utxoData.change;
                    for (let key in utxos) {
                        console.log("addSignedUtxos adding input ", utxos[key].txid, utxos[key].vout);
                        txb.addInput(utxos[key].txid, utxos[key].vout);
                    }
                    txb.addOutput(to, amount);
                    txb.addOutput(from, change);
                    let i = 0;
                    for (let key in utxos) {
                        txb.sign(i, keyring)
                        i++;
                    }
                    return resolve(txb);
                }
            } catch (e) {
                return reject(e);
            }
        })
    }

    getUtxos(address, amount, fee) {
        return new Promise(async (resolve, reject) => {
            try {
                this.validator.validateAddress(address);
                this.validator.validateNumber(amount);
                this.validator.validateNumber(fee);

                let balance = await this.getBalance(address);
                if (balance >= amount + fee) {
                    let allUtxo = await this.listUnspent(address);
                    let tmpSum = 0;
                    let requiredUtxo = [];
                    for (let key in allUtxo) {
                        if (tmpSum <= amount + fee) {
                            tmpSum += allUtxo[key].value;
                            requiredUtxo.push({
                                txid: allUtxo[key].tx_hash,
                                vout: allUtxo[key].tx_output_n
                            })
                        } else {
                            break;
                        }
                    }

                    let change = tmpSum - amount - fee;
                    this.validator.validateNumber(change);

                    let utxos = {
                        "change": change,
                        "outputs": requiredUtxo
                    };
                    return resolve(utxos);
                } else {
                    amount = this.converter.toDecimals(amount)
                    fee = this.converter.toDecimals(fee)
                    balance = this.converter.toDecimals(balance)
                    console.log("Insufficient balance: trying to send " + amount + " BTC + " + fee + " BTC fee when having " + balance + " BTC")
                    return resolve(WRONG_FEE)
                }
            } catch (e) {
                return reject(e);
            }
        });
    }

    listUnspent(address) {
        return new Promise(async (resolve, reject) => {
            try {
                this.validator.validateAddress(address);
                let url = this.urlCompose(GET_UTXO, {address: address});
                let data = await this.getRequest(url)
                let unspents = data.txrefs;
                return resolve(unspents);
            } catch (e) {
                return reject(e);
            }
        })
    }

    sendTx(rawTx) {
        return new Promise(async (resolve, reject) => {
            try {
                this.validator.validateString(rawTx, "rawTx");
                let url = this.urlCompose(SEND);
                let body = JSON.stringify({"tx": rawTx});
                let result = await this.postRequest(url, body);
                return resolve(result.tx.hash);
            } catch (e) {
                return reject(e)
            }
        })
    }

    getRequest(url) {
        return new Promise(async (resolve, reject) => {
            try {
                let response = null;
                try {
                    response = await this.httpService.getRequest(url);
                } catch (e) {
                    throw PROBLEM_WITH_NODE;
                }
                let result = await response.json();
                return resolve(result);
            } catch (e) {
                return reject(e);
            }
        })
    }

    postRequest(url, body) {
        return new Promise(async (resolve, reject) => {
            try {
                let response = null;
                try {
                    response = await this.httpService.postRequest(url, body);
                } catch (e) {
                    return resolve(PROBLEM_WITH_NODE)
                }
                let result = await response.json();
                return resolve(result);
            } catch (e) {
                return reject(e);
            }
        })
    }
}

module.exports = BlockcypherProvider;