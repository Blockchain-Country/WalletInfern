const BtcConverter = require('/src/core/helpers/BtcConverter');
const BtcValidator = require('/src/core/validators/blockchain/BtcValidator');
const AbstractCurrencyLib = require('/src/core/blockchain/AbstractCurrencyLib')
const BlockCypherProvider = require('/src/core/blockchain/btc/BlockcypherProvider');
const {ECPair, TransactionBuilder, networks} = require('bitcoinjs-lib');
const BTC_NETWORK_TEST = networks.testnet;

class BtcLib extends AbstractCurrencyLib {

    constructor(app) {
        let validator = new BtcValidator();
        let converter = new BtcConverter();
        let provider = new BlockCypherProvider(app, validator, converter);
        super(app, provider, validator, converter);
    }

    getBalance(address) {
        return new Promise(async (resolve, reject) => {
            try {
                this.validator.validateAddress(address);
                let balance = await this.provider.getBalance(address);
                balance = this.converter.toDecimals(balance);
                return resolve(balance);
            } catch (e) {
                return reject(e);
            }
        })
    }

    sendFunds(to, amount) {
        return new Promise(async (resolve, reject) => {
            try {
                let txParams = await this._formatTransactionParameters(to, amount)
                let rawTx = await this._createSignRawTx(txParams);
                let txHash = await this.provider.sendTx(rawTx);
                return resolve(txHash);
            } catch (e) {
                return reject(e)
            }
        })
    }

    _getNetwork() {
        return BTC_NETWORK_TEST;
    }

    _createSignRawTx(txParams) {
        return new Promise(async (resolve, reject) => {
            try {
                let wif = await this.getPrivateKey();
                let keyring = await ECPair.fromWIF(wif, this._getNetwork());
                let txb = new TransactionBuilder(this._getNetwork());
                txb = await this.provider.addSignedUtxos(keyring, txb, txParams["from"], txParams["to"], txParams["amount"], txParams["fee"]);
                let txHash = txb.build().toHex();
                this.validator.validateString(txHash, 'txHash');
                return resolve(txHash)
            } catch (e) {
                return reject(e);
            }
        })
    }

    _formatTransactionParameters(to, amount) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = await this.getAddress();
                this.validator.validateAddress(from);
                this.validator.validateAddress(to);

                let fee = await this.getFee();
                this.validator.validateNumber(fee);

                amount = parseFloat(amount);
                this.validator.validateNumber(amount);

                amount = this.converter.fromDecimals(amount);
                fee = this.converter.fromDecimals(fee);
                amount = Math.round(amount);
                fee = Math.round(fee);

                let txParams = {
                    from: from,
                    to: to,
                    amount: amount,
                    fee: fee
                }
                return resolve(txParams);
            } catch (e) {
                return reject(e);
            }
        })
    }

    getFee() {
        return new Promise(async (resolve, reject) => {
            try {
                let fee = await this.provider.getFee()
                return resolve(fee);
            } catch (e) {
                return reject(e)
            }
        })
    }
}

module.exports = BtcLib;
