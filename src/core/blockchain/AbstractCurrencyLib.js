const Validator = require('/src/core/validators/Validator');
const staticValidator = new Validator();

class AbstractCurrencyLib {
    constructor(provider, validator, converter) {
        staticValidator.validateObject(provider, "provider");
        staticValidator.validateObject(validator, "validator");
        staticValidator.validateObject(converter, "converter");
        this.provider = provider;
        this.validator = validator;
        this.converter = converter;
    }

    getAddress() {
        return new Promise(async (resolve, reject) => {
            try {
                throw("getAddress() not implemented");
            } catch (e) {
                return reject(e);
            }
        })
    };

    getPrivateKey() {
        return new Promise(async (resolve, reject) => {
            try {
                throw("getPrivateKey() not implemented");
            } catch (e) {
                return reject(e);
            }
        })
    }

    // getBalance() {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             console.log("Abstract getBalance start");
    //             let address = await this.getAddress();
    //             console.log("Abstract getBalance middle", address);
    //             let balance = await this.getBalance(address);
    //             console.log("Abstract getBalance end", balance);
    //             return resolve(balance);
    //         } catch (e) {
    //             return reject(e);
    //         }
    //     })
    // }

    getBalance(address) {
        return new Promise(async (resolve, reject) => {
            try {
                throw("getBalance() not implemented")
            } catch (e) {
                return reject(e);
            }
        })
    }

    sendFunds(to, amount) {
        return new Promise(async (resolve, reject) => {
            try {
                throw("sendFunds() not implemented")
            } catch (e) {
                return reject(e);
            }
        });
    }
}

module.exports = AbstractCurrencyLib;