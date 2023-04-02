const Web3 = require("web3");
const Transaction = require("ethereumjs-tx");
const EthConverter = require("../../helpers/EthConverter");
const Validator = require("../../validators/blockchain/EthValidator")
const AbstractCurrencyLib = require("/src/core/blockchain/AbstractCurrencyLib");

const ETH_ADDRESS = process.env.ETH_ADDRESS;
const ETH_PRIVATE_KEY = process.env.ETH_PRIVATE_KEY;
const ETH_PROVIDER_URL = process.env.ETH_PROVIDER_URL;

let GWEI = 10 ** 9;
let GAS_PRICE = 70 * GWEI;
let GAS_LIMIT = 21000;

class EthLib extends AbstractCurrencyLib {
    constructor() {
        let web3 = new Web3(new Web3.providers.HttpProvider(ETH_PROVIDER_URL));
        let converter = new EthConverter();
        let validator = new Validator();
        super(web3, validator, converter);
    }

    getAddress() {
        return new Promise(async (resolve, reject) => {
            try {
                this.validator.validateAddress(ETH_ADDRESS)
                return resolve(ETH_ADDRESS);
            } catch (e) {
                return reject(e);
            }
        });
    }

    getPrivateKey() {
        return new Promise(async (resolve, reject) => {
            try {
                return resolve(ETH_PRIVATE_KEY);
            } catch (e) {
                return reject(e);
            }
        });
    }

    getBalance() {
        return new Promise(async (resolve, reject) => {
            try {
                // let _address = await this.provider.getAddress();
                let balanceWei = await this.provider.eth.getBalance(ETH_ADDRESS);
                let balanceEth = this.toDecimal(balanceWei);
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
        //   console.log("From ETH_ADDRESS:", receipt.from);
        //   console.log("To ETH_ADDRESS:", receipt.to);
        //   console.log("Gas used:", receipt.gasUsed);
        // } catch (error) {
        //   console.error("Error sending transaction:", error);
        // }
        return new Promise(async (resolve, reject) => {
            try {
                this.validator.validateNumber(amount, "sendFunds() amount");
                this.validator.validateAddress(to, "sendFunds() ETH_ADDRESS to");
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
                // if (typeof ETH_PRIVATE_KEY !== "string") {
                //     ETH_PRIVATE_KEY = ETH_PRIVATE_KEY.toString("hex");
                // }
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
                    value: this.provider.utils.numberToHex(value),
                    gasPrice: this.provider.utils.numberToHex(gasPrice),
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
                this.provider.eth
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
                let nonce = await this.provider.eth.getTransactionCount(ETH_ADDRESS);
                return resolve(nonce);
            } catch (e) {
                return reject(e);
            }
        });
    }

    toDecimal(amount) {
        // return this.web3.utils.fromWei(amount.toString(), "ether");
        return this.converter.toDecimals(amount);
    }

    fromDecimal(amount) {
        // return this.web3.utils.toWei(amount.toString(), "ether");
        return this.converter.fromDecimals(amount);
    }

    getGasPrice() {
        return GAS_PRICE;
    }

    getGasLimit() {
        return GAS_LIMIT;
    }
}

module.exports = EthLib;
