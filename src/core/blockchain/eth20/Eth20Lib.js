const Web3 = require("web3");
const Transaction = require("ethereumjs-tx");
const Eth20Converter = require("../../helpers/Eth20Converter");
const Validator = require("../../validators/blockchain/EthValidator");
const AbstractCurrencyLib = require("/src/core/blockchain/AbstractCurrencyLib");

const ETH20_ADDRESS = process.env.ETH20_ADDRESS;
const ETH20_PRIVATE_KEY = process.env.ETH20_PRIVATE_KEY;
const ETH20_PROVIDER_URL = process.env.ETH20_PROVIDER_URL;

let GWEI = 10 ** 9;
let GAS_PRICE = 70 * GWEI;
let GAS_LIMIT = 21000;

class Eth20Lib extends AbstractCurrencyLib {
    constructor() {
        let web3 = new Web3(new Web3.providers.HttpProvider(ETH20_PROVIDER_URL));
        let converter = new Eth20Converter();
        let validator = new Validator();
        super(web3, validator, converter);
    }

    getAddress() {
        return new Promise(async (resolve, reject) => {
            try {
                this.validator.validateAddress(ETH20_ADDRESS)
                return resolve(ETH20_ADDRESS);
            } catch (e) {
                return reject(e);
            }
        });
    }

    getPrivateKey() {
        return new Promise(async (resolve, reject) => {
            try {
                return resolve(ETH20_PRIVATE_KEY);
            } catch (e) {
                return reject(e);
            }
        });
    }

    getBalance() {
        return new Promise(async (resolve, reject) => {
            try {
                // let _address = await this.getAddress();
                let balanceWei = await this.provider.eth.getBalance(ETH20_ADDRESS);
                let balanceEth = await this.toDecimal(balanceWei);
                return resolve(balanceEth);
            } catch (e) {
                return reject(e);
            }
        });
    }

    sendFunds(to, amount) {
        return new Promise(async (resolve, reject) => {
            try {
                this.validator.validateNumber(amount, "sendFunds() amount");
                this.validator.validateAddress(to, "sendFunds() ETH20_ADDRESS to");
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
                // if (typeof ETH20_PRIVATE_KEY !== "string") {
                //     ETH20_PRIVATE_KEY = ETH20_PRIVATE_KEY.toString("hex");
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
                let nonce = await this.provider.eth.getTransactionCount(ETH20_ADDRESS);
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

module.exports = Eth20Lib;
