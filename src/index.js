const WalletUI = require("./core/ui/WalletUI");
const BlockchainService = require("./core/blockchain/BlockchainService");
const HttpService = require('/src/core/services/HttpService');

const MNEMONIC_PROMPT = "Enter Mnemonic!";

class Application {

    constructor() {
        // this.setCurrency(MNEMONIC_PROMPT)
        this.httpService = new HttpService(this);
        this.walletUI = new WalletUI(this);
        this.blockchainService = new BlockchainService(this);
    }

    changeCurrency(_currencyName) {
        this.setCurrency(_currencyName);
        this.prepareUI();
    }

    prepareUI() {
        this.walletUI.prepareUI();
    }

    setCurrency(_currencyName) {
        this.currencyName = _currencyName;
    }

    getCurrency() {
        return this.currencyName;
    }

    getCurrentBalance() {
        return new Promise(async (resolve, reject) => {
            try {
                let balance = await this.blockchainService.getCurrentBalance();
                return resolve(balance);
            } catch (e) {
                console.error("Error in index.js getCurrentBalance():", e);
                return reject(e);
            }
        })
    }

    getAddress() {
        return new Promise(async (resolve, reject) => {
            try {
                let address = await this.blockchainService.getAddress();
                return resolve(address);
            } catch (e) {
                return reject(e);
            }
        });
    }

    sendFunds(to, amount) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await this.blockchainService.sendFunds(to, amount);
                return resolve(result);
            } catch (e) {
                return reject(e);
            }
        });
    }

    generateMnemonic() {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await this.blockchainService.generateMnemonic();
                return resolve(result);
            } catch (e) {
                return reject(e);
            }
        })
    }

    importMnemonic(mnemonic) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await this.blockchainService.importMnemonic(mnemonic);
                this.prepareUI();
                return resolve(result);
            } catch (e) {
                console.error("Error in index.js importMnemonic():", e);
                return reject(e);
            }
        })
    }
}

let app = new Application();
// app.prepareUI();
