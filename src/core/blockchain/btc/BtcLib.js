const BtcConverter = require('/src/core/helpers/BtcConverter');
const BtcValidator = require('/src/core/validators/blockchain/BtcValidator');
const AbstractCurrencyLab = require('/src/core/blockchain/AbstractCurrencyLib')
const BlockCypherProvider = require('/src/core/blockchain/btc/BlockCypherProvider');
const {ECPair,TransactionBuilder,networks} = require('bitcoinjs-lib');
const BTCNETWORK = networks.testnet;

// const BTC_ADDRESS = process.env.BTC_ADDRESS;
// const BTC_WIF = process.env.BTC_WIF;

class BtcLib extends AbstractCurrencyLab{

    constructor(app) {
        let validator = new BtcValidator();
        let converter = new BtcConverter();
        let provider = new BlockCypherProvider(app, validator, converter);
        super(app, provider,validator,converter);
    }

    getBalance(address){
        return new Promise(async(resolve,reject)=>{
            try{
                this.validator.validateAddress(address);
                let balance = await this.provider.getBalance(address);
                balance = this.converter.toDecimals(balance);
                console.log("getBalance balance toDecimals = ",balance);
                return resolve(balance);
            }catch (e){
                return reject(e);
            }
        })
    }

    sendFunds(to,amount){
        return new Promise(async(resolve,reject)=>{
            try{
                console.log("btcLib sendCurrency start")
                let txParams = await this._formatTransactionParameters(to,amount)
                console.log("btcLib sendCurrency formatTxParams",txParams)
                let rawTx = await this._createSignRawTx(txParams);
                console.log("btcLib sendCurrency rawTx",rawTx)
                let txHash = await this.provider.sendTx(rawTx);
                console.log("btcLib sendCurrency sendTx",txHash)
                return resolve(txHash);
            }catch (e) {
                return reject(e)
            }
        })
    }

    _createSignRawTx(txParams){
        return new Promise(async(resolve,reject)=>{
            try {
                console.log("btc lib createSignRawTx");
                let wif = await this.getPrivateKey();
                let keyring = await ECPair.fromWIF(wif, BTCNETWORK);
                console.log("keyring",keyring);
                console.log("btcLib txb")
                let txb = new TransactionBuilder(BTCNETWORK);
                console.log("btcLib addSignedUtxos");
                txb = await this.provider.addSignedUtxos(keyring,txb,txParams["from"],txParams["to"],txParams["amount"],txParams["fee"]);
                console.log("btcLib txb")
                let txHash = txb.build().toHex();
                this.validator.validateString(txHash,'txHash');
                console.log('_createSignRawTx end txHash ',txHash);
                return resolve(txHash)
            }catch (e){
                return reject(e);
            }
        })
    }

    _formatTransactionParameters(to,amount){
        return new Promise(async(resolve,reject)=>{
            try{
                let from = await this.getAddress();
                let fee = await this.getFee();
                console.log('formatTxParams fee',fee)
                amount = parseFloat(amount);
                console.log('formatTxParams amount',amount)
                this.validator.validateAddress(to);
                this.validator.validateNumber(amount);
                this.validator.validateNumber(fee);
                console.log('formatTxParams validate over')
                amount = this.converter.fromDecimals(amount);
                fee = this.converter.fromDecimals(fee);
                console.log('formatTxParams afterDecimals',fee)
                amount = Math.round(amount);
                fee = Math.round(fee);
                console.log('formatTxParams before txParams',amount)
                let txParams={
                    from:from,
                    to:to,
                    amount:amount,
                    fee:fee
                }
                console.log('formatTxParams txDParams',txParams)
                return resolve(txParams);
            }catch (e){
                return reject(e);
            }
        })
    }

    getFee(){
        return new Promise(async(resolve,reject)=>{
            try{
                let fee = await this.provider.getFee()
                console.log("btcLib getFee",fee);
                return resolve(fee);
            }catch(e){
                return reject(e)
            }
        })
    }
}

module.exports = BtcLib;