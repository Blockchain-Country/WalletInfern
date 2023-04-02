const BtcConverter = require('/src/core/helpers/BtcConverter');
const BtcValidator = require('/src/core/validators/blockchain/BtcValidator');
const AbstractCurrencyLab = require('/src/core/blockchain/AbstractCurrencyLib')
const BlockCypherProvider = require('/src/core/blockchain/btc/BlockCypherProvider');

const BTC_ADDRESS = process.env.BTC_ADDRESS;
const BTC_WIF = process.env.BTC_WIF;

class BtcLib extends AbstractCurrencyLab{

    constructor() {
        let provider = new BlockCypherProvider();
        let validator = new BtcValidator();
        let converter = new BtcConverter();
        super(provider,validator,converter);
    }

    getAddress(){
        return new Promise(async(resolve,reject)=>{
            try{
                return resolve(BTC_ADDRESS);
            }catch(e){
                return reject(e);
            }
        })
    };

    getBalance(address){
        return new Promise(async(resolve,reject)=>{
            try{
                this.validator.validateAddress(BTC_ADDRESS);
                let balance = await this.provider.getBalance(BTC_ADDRESS);
                balance = this.converter.toDecimals(balance);
                return resolve(balance);
            }catch (e){
                return reject(e);
            }
        })
    }
}

module.exports = BtcLib;