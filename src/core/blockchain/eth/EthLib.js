const Web3 = require("web3");
const Transaction = require("ethereumjs-tx");
const EthConverter = require("../../helpers/EthConverter");
const Validator = require("../../validators/blockchain/EthValidator")
const AbstractCurrencyLib = require("/src/core/blockchain/AbstractCurrencyLib");
const ETH_PROVIDER_URL = process.env.ETH_PROVIDER_URL;
const CHAIN_ID = 11155111;

// const ETH_ADDRESS = process.env.ETH_ADDRESS;
// const ETH_PRIVATE_KEY = process.env.ETH_PRIVATE_KEY;

let GWEI = 10 ** 9;
let GAS_PRICE = 70 * GWEI;
let GAS_LIMIT = 21000;

class EthLib extends AbstractCurrencyLib {
    constructor(app) {
        let web3 = new Web3(new Web3.providers.HttpProvider(ETH_PROVIDER_URL));
        let converter = new EthConverter();
        let validator = new Validator();
        super(app, web3, validator, converter);
    }

    getBalance(address) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log("EthLib getBalance address: ", address)
                this.validator.validateAddress(address);
                let balanceWei = await this.provider.eth.getBalance(address);
                console.log("EthLib getBalance before after")
                let balanceEth = await this.toDecimal(balanceWei);
                console.log("EthLib getBalance before after balance ", balanceEth)
                return resolve(balanceEth);
            } catch (e) {
                return reject(e);
            }
        });
    }

    sendFunds(to, amount) {
        return new Promise(async (resolve, reject) => {
            try {
                this.validator.validateAddress(to, "sendFunds() ETH_ADDRESS to");
                this.validator.validateNumber(amount, "sendFunds() amount");
                let txData = await this._formatTransactionParams(to, amount);
                let hash = await this._sendTransaction(txData);
                return resolve(hash);
            } catch (e) {
                return reject(e);
            }
        });
    }

    _getChainId() {
        return CHAIN_ID;
    }

    _formatTransactionParams(to, amount, data = "") {
        return new Promise(async (resolve, reject) => {
            try {
                this.validator.validateAddress(to);

                this.validator.validateNumber(amount);
                let value = this.fromDecimal(amount);
                let valueHex = this.provider.utils.numberToHex(value);
                this.validator.validateNumber(valueHex);

                this.validator.validateString(data);
                let privateKey = await this.getPrivateKey();
                this.validator.validateString(privateKey);
                let privateKeyBuffer = Buffer.from(privateKey, "hex");

                let from = await this.getAddress();
                this.validator.validateAddress(from);

                let nonce = await this.getNextNonce();
                this.validator.validateNumber(nonce);

                let gasPrice = this.getGasPrice();
                this.validator.validateNumber(gasPrice);
                let gasPriceHex = this.provider.utils.numberToHex(gasPrice)
                this.validator.validateNumber(gasPriceHex);

                let gasLimit = this.getGasLimit();
                this.validator.validateNumber(gasLimit);

                let chainId = this._getChainId();
                console.log("ETH type of", typeof chainId);
                this.validator.validateNumber(chainId);

                let txParams = {
                    from: from,
                    to: to,
                    privateKey: privateKeyBuffer,
                    value: valueHex,
                    gasPrice: gasPriceHex,
                    gasLimit: gasLimit,
                    nonce: nonce,
                    data: data,
                    chainId: chainId
                };
                return resolve(txParams);
            } catch (e) {
                return reject(e);
            }
        });
    }

    _sendTransaction(txParams) {
        return new Promise(async (resolve, reject) => {
            try {
                let tx = new Transaction(txParams);
                tx.sign(txParams.privateKey);
                let raw = "0x" + tx.serialize().toString("hex");
                this.provider.eth
                    .sendSignedTransaction(raw)
                    .on("receipt", (data) => {
                        console.log("_sendTransaction", data);
                        let transactionHash = data["transactionHash"];
                        console.log("_sendTransaction", transactionHash);
                        return resolve(transactionHash);
                    })
                    .on("error", (e) => {
                        console.error(e);
                        return reject(e);
                    });
            } catch (e) {
                return reject(e);
            }
        });
    }

    getNextNonce() {
        return new Promise(async (resolve, reject) => {
            try {
                let address = await this.app.getAddress();
                let nonce = await this.provider.eth.getTransactionCount(address);
                return resolve(nonce);
            } catch (e) {
                return reject(e);
            }
        });
    }

    toDecimal(amount) {
        // return this.web3.utils.fromWei(amount.toString(), "ether");
        return this.converter.toDecimals(amount);
    }

    fromDecimal(amount) {
        // return this.web3.utils.toWei(amount.toString(), "ether");
        return this.converter.fromDecimals(amount);
    }

    getGasPrice() {
        return GAS_PRICE;
    }

    getGasLimit() {
        return GAS_LIMIT;
    }
}

module.exports = EthLib;