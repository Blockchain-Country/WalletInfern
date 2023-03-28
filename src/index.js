const WalletUI = require("./core/ui/WalletUI");
const BlockchainService = require("./core/blockchain/BlockchainService");

class Application {
  constructor() {
    this.walletUI = new WalletUI(this);
    this.blockchainService = new BlockchainService();
  }

  preperUI() {
    this.walletUI.preperUI();
  }

  getCurrency() {
    return "Choose currency!";
  }

  getBallance() {
    return new Promise(async (resolve, reject) => {
      try {
        let balance = await this.blockchainService.getBallance();
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
app.preperUI();
