const Web3 = require("web3");
const Transaction = require("ethereumjs-tx");
const Erc20Converter = require("../../helpers/Erc20Converter");
const EthValidator = require("../../validators/blockchain/EthValidator");
const EthLib = require("../eth/EthLib");

const ERC20_PROVIDER_URL = process.env.ERC20_PROVIDER_URL;

class Erc20Lib extends EthLib {
    constructor(app) {
        let web3 = new Web3(new Web3.providers.HttpProvider(ERC20_PROVIDER_URL));
        let erc20Converter = new Erc20Converter();
        let ethValidator = new EthValidator();
        super(app, web3, ethValidator, erc20Converter);
    }
    //
    // getBalance(address) {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             console.log("Erc20Lib getBalance address: ", address)
    //             this.validator.validateAddress(address);
    //             let balanceWei = await this.provider.eth.getBalance(address);
    //             console.log("Erc20Lib getBalance before after")
    //             let balanceEth = await this.toDecimal(balanceWei);
    //             console.log("Erc20Lib getBalance before after balance ", balanceEth)
    //             return resolve(balanceEth);
    //         } catch (e) {
    //             return reject(e);
    //         }
    //     });
    // }
    //
    // sendFunds(to, amount) {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             this.validator.validateNumber(amount, "sendFunds() amount");
    //             this.validator.validateAddress(to, "sendFunds() Erc20_ADDRESS to");
    //             let txData = await this._formatTransactionParams(to, amount);
    //             let hash = await this._sendTransaction(txData);
    //             return resolve(hash);
    //         } catch (e) {
    //             return reject(e);
    //         }
    //     });
    // }
    //
    // _formatTransactionParams(to, amount, data = "") {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             this.validator.validateAddress(to);
    //
    //             this.validator.validateNumber(amount);
    //             let value = this.fromDecimal(amount);
    //             let valueHex = this.provider.utils.numberToHex(value);
    //             this.validator.validateNumber(valueHex);
    //
    //             this.validator.validateString(data);
    //             let privateKey = await this.getPrivateKey();
    //             this.validator.validateString(privateKey);
    //             let privateKeyBuffer = Buffer.from(privateKey, "hex");
    //
    //             let from = await this.getAddress();
    //             this.validator.validateAddress(from);
    //
    //             let nonce = await this.getNextNonce();
    //             this.validator.validateNumber(nonce);
    //
    //             let gasPrice = this.getGasPrice();
    //             this.validator.validateNumber(gasPrice);
    //             let gasPriceHex = this.provider.utils.numberToHex(gasPrice)
    //             this.validator.validateNumber(gasPriceHex);
    //
    //             let gasLimit = this.getGasLimit();
    //             this.validator.validateNumber(gasLimit);
    //             let txParams = {
    //                 from: from,
    //                 to: to,
    //                 privateKey: privateKeyBuffer,
    //                 value: valueHex,
    //                 gasPrice: gasPriceHex,
    //                 gasLimit: gasLimit,
    //                 nonce: nonce,
    //                 data: data,
    //             };
    //             return resolve(txParams);
    //         } catch (e) {
    //             return reject(e);
    //         }
    //     });
    // }
    //
    // _sendTransaction(txParams) {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             let tx = new Transaction(txParams);
    //             tx.sign(txParams.privateKey);
    //             let raw = "0x" + tx.serialize().toString("hex");
    //             this.provider.eth
    //                 .sendSignedTransaction(raw)
    //                 .on("receipt", (data) => {
    //                     console.log(data);
    //                     let transactionHash = data["transactionHash"];
    //                     console.log(transactionHash);
    //                     return resolve(transactionHash);
    //                 })
    //                 .on("error", (e) => {
    //                     console.error(e);
    //                     return reject(e);
    //                 });
    //         } catch (e) {
    //             return reject(e);
    //         }
    //     });
    // }
    //
    // getNextNonce(to, value, data) {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             let address = await this.app.getAddress();
    //             let nonce = await this.provider.eth.getTransactionCount(address);
    //             return resolve(nonce);
    //         } catch (e) {
    //             return reject(e);
    //         }
    //     });
    // }
    //
    // toDecimal(amount) {
    //     // return this.web3.utils.fromWei(amount.toString(), "ether");
    //     return this.converter.toDecimals(amount);
    // }
    //
    // fromDecimal(amount) {
    //     // return this.web3.utils.toWei(amount.toString(), "ether");
    //     return this.converter.fromDecimals(amount);
    // }
    //
    // getGasPrice() {
    //     return GAS_PRICE;
    // }
    //
    // getGasLimit() {
    //     return GAS_LIMIT;
    // }
}

module.exports = Erc20Lib;
