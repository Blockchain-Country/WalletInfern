const WalletUI = require("./core/ui/WalletUI");
const BlockchainService = require("./core/blockchain/BlockchainService");

const CURRENCY = "ETH";

class Application {

  constructor() {
    this.setCurrency(CURRENCY)
    this.walletUI = new WalletUI(this);
    this.blockchainService = new BlockchainService(this);
  }

  changeCurrency(_currencyName){
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

  getBalance() {
    return new Promise(async (resolve, reject) => {
      try {
        let balance = await this.blockchainService.getBalance();
        return resolve(balance);
      } catch (e) {
        return reject(e);
      }
    });
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
}

let app = new Application();
app.prepareUI();
