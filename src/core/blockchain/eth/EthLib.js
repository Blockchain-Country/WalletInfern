const Web3 = require("web3");
const Transaction = require("ethereumjs-tx");
const secrets = require("../../../../secrets/Secret.js");

let address = "0xd407B30475a7AE279359f1f0172600F4e391f564";

let GWEI = 10 ** 9;
let GAS_PRICE = 70 * GWEI;
let GAS_LIMIT = 21000;

class EthLib {
  constructor() {
    this.web3 = new Web3(new Web3.providers.HttpProvider(secrets.PROVIDER_URL));
  }

  getAddress() {
    return new Promise(async (resolve, reject) => {
      try {
        return resolve(address);
      } catch (e) {
        return reject(e);
      }
    });
  }

  getPrivateKey() {
    return new Promise(async (resolve, reject) => {
      try {
        return resolve(secrets.PRIVATE_KEY);
      } catch (e) {
        return reject(e);
      }
    });
  }

  getBallance() {
    return new Promise(async (resolve, reject) => {
      try {
        let _address = await this.getAddress();
        let balanceWei = await this.web3.eth.getBalance(_address);
        let balanceEth = await this.toDecimal(balanceWei);
        return resolve(balanceEth);
      } catch (e) {
        return reject(e);
      }
    });
  }

  sendFunds(to, amount) {
    // const addressInput = document.getElementById("address_input").value;
    // const amountInput = document.getElementById("amount_input").value;
    // // Validate data input
    // if (!addressInput || !amountInput) {
    //   throw new Error("Invalid input");
    // }
    // // Convert the amount to wei
    // const amountWei = web3.utils.toWei(amountInput.toString(), "ether");
    // // Create the transaction object
    // const txObject = {
    //   from: myAddress,
    //   to: addressInput,
    //   value: amountWei,
    // };
    // try {
    //   // Sign and send the transaction
    //   const tx = web3.eth.sendTransaction(txObject);
    //   console.log("Transaction sent:", tx);
    //   // Get transaction details using the transaction hash
    //   const receipt = web3.eth.getTransactionReceipt(tx.transactionHash);
    //   console.log("Transaction details:", receipt);
    //   console.log("From address:", receipt.from);
    //   console.log("To address:", receipt.to);
    //   console.log("Gas used:", receipt.gasUsed);
    // } catch (error) {
    //   console.error("Error sending transaction:", error);
    // }
    return new Promise(async (resolve, reject) => {
      try {
        let txData = await this._formatTransactionParams(to, amount);
        let hash = await this._sendTransaction(txData);
        return resolve(hash);
      } catch (e) {
        return reject(e);
      }
    });
  }

  _formatTransactionParams(to, amount, data = "") {
    return new Promise(async (resolve, reject) => {
      try {
        let privateKey = await this.getPrivateKey();
        if (typeof privateKey !== "string") {
          privateKey = privateKey.toString("hex");
        }
        let privateKeyBuffer = Buffer.from(privateKey, "hex");
        let from = await this.getAddress();
        let nonce = await this.getNextNonce();
        let gasPrice = this.getGasPrice();
        let gasLimit = this.getGasLimit();
        let value = this.fromDecimal(amount);
        let txParams = {
          from: from,
          to: to,
          privateKey: privateKeyBuffer,
          value: this.web3.utils.numberToHex(value),
          gasPrice: this.web3.utils.numberToHex(gasPrice),
          gasLimit: gasLimit,
          nonce: nonce,
          data: data,
        };
        return resolve(txParams);
      } catch (e) {
        return reject(e);
      }
    });
  }

  _sendTransaction(txParams) {
    return new Promise(async (resolve, reject) => {
      try {
        let tx = new Transaction(txParams);
        tx.sign(txParams.privateKey);
        let raw = "0x" + tx.serialize().toString("hex");
        this.web3.eth
          .sendSignedTransaction(raw)
          .on("receipt", (data) => {
            console.log(data);
            let transactionHash = data["transactionHash"];
            console.log(transactionHash);
            return resolve(transactionHash);
          })
          .on("error", (e) => {
            console.error(e);
            return reject(e);
          });
      } catch (e) {
        return reject(e);
      }
    });
  }

  getNextNonce(to, value, data) {
    return new Promise(async (resolve, reject) => {
      try {
        let address = await this.getAddress();
        let nonce = await this.web3.eth.getTransactionCount(address);
        return resolve(nonce);
      } catch (e) {
        return reject(e);
      }
    });
  }

  toDecimal(amount) {
    return this.web3.utils.fromWei(amount.toString(), "ether");
  }

  fromDecimal(amount) {
    return this.web3.utils.toWei(amount.toString(), "ether");
  }

  getGasPrice() {
    return GAS_PRICE;
  }

  getGasLimit() {
    return GAS_LIMIT;
  }
}

module.exports = EthLib;
