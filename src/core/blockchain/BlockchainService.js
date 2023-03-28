const EthLib = require("./eth/EthLib");
const Eth20Lib = require("./eth20/Eth20Lib");

class BlockchainService {
  constructor() {
    this.eth = new EthLib();
    this.eth20 = new Eth20Lib();
  }

  getBallance() {
    return new Promise(async (resolve, reject) => {
      try {
        let balance = await this.eth.getBallance();
        return resolve(balance);
      } catch (e) {
        return reject(e);
      }
    });
  }

  getAddress() {
    return new Promise(async (resolve, reject) => {
      try {
        let address = await this.eth.getAddress();
        return resolve(address);
      } catch (e) {
        return reject(e);
      }
    });
  }

  sendFunds(to, amount) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await this.eth.sendFunds(to, amount);
        return resolve(result);
      } catch (e) {
        return reject(e);
      }
    });
  }
}

module.exports = BlockchainService;
