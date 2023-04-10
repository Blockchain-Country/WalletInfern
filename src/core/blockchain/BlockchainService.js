const EthLib = require("./eth/EthLib");
const Eth20Lib = require("./eth20/Eth20Lib");
const BtcLib = require("./btc/BtcLib");
const CredentialService = require("/src/core/blockchain/credentials/CredentialService")

class BlockchainService {
    constructor(app) {
        this.app = app;
        this.credentials = new CredentialService(app);
        let eth = new EthLib(app);
        let eth20 = new Eth20Lib(app);
        let btc = new BtcLib(app);
        this.libraries = {
            "ETH": eth,
            "ETH20": eth20,
            "BTC": btc
        };
    }

    getCurrentLibrary() {
        return this.libraries[this.app.getCurrency()]
    }

    getCurrentBalance(){
        return new Promise(async(resolve,reject)=>{
            try{
                let balance =await this.getCurrentLibrary().getCurrentBalance();
                return resolve(balance);
            }catch (e){
                return reject(e);
            }
        })
    }

    getAddress() {
        return new Promise(async (resolve, reject) => {
            try {
                let address = await this.getCurrentLibrary().getAddress();
                return resolve(address);
            } catch (e) {
                return reject(e);
            }
        });
    }

    sendFunds(to, amount) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await this.getCurrentLibrary().sendFunds(to, amount);
                return resolve(result);
            } catch (e) {
                return reject(e);
            }
        });
    }

    generateMnemonic() {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await this.credentials.generateMnemonic();
                return resolve(result);
            } catch (e) {
                return reject(e);
            }
        })
    }

    importMnemonic(mnemonic) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await this.credentials.importMnemonic(mnemonic);

                // TODO Update credentials
                return resolve(result);
            } catch (e) {
                return reject(e);
            }
        })
    }
}

module.exports = BlockchainService;
