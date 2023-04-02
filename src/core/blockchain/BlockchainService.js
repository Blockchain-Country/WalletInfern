const EthLib = require("./eth/EthLib");
const Eth20Lib = require("./eth20/Eth20Lib");
const BtcLib = require("./btc/BtcLib");

class BlockchainService {
    constructor(app) {
        this.app = app;
        let eth = new EthLib();
        let eth20 = new Eth20Lib();
        let btc = new BtcLib();
        this.libraries = {
            "ETH": eth,
            "ETH20": eth20,
            "BTC": btc
        };
    }

    getCurrentLibrary() {
        return this.libraries[this.app.getCurrency()]
    }

    getBalance() {
        return new Promise(async (resolve, reject) => {
            try {
                let balance = await this.getCurrentLibrary().getBalance();
                return resolve(balance);
            } catch (e) {
                return reject(e);
            }
        });
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
}

module.exports = BlockchainService;
