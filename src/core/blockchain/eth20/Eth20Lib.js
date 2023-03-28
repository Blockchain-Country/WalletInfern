const Web3 = require("web3");
const Transaction = require("ethereumjs-tx");
const secrets = require("../../../../secrets/Secret.js");

let address = "0xd407B30475a7AE279359f1f01726007777777777";

class Eth20Lib {
  getAddress() {
    return new Promise(async (resolve, reject) => {
      try {
        return resolve(address);
      } catch (e) {
        return reject(e);
      }
    });
  }
}

module.exports = Eth20Lib;
