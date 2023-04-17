const Validator = require('/src/core/validators/Validator');
const staticValidator = new Validator();

class AbstractCurrencyLib {
    constructor(app, provider, validator, converter) {
        this.app = app;
        staticValidator.validateObject(provider, "provider");
        staticValidator.validateObject(validator, "validator");
        staticValidator.validateObject(converter, "converter");
        this.provider = provider;
        this.validator = validator;
        this.converter = converter;
    }

    getCredentials() {
        return this.app.blockchainService.credentials;
    }

    getAddress() {
        return new Promise(async (resolve, reject) => {
            try {
                let address = await this.getCredentials().getAddress();
                return resolve(address);
            } catch (e) {
                return reject(e);
            }
        })
    };

    getPrivateKey() {
        return new Promise(async (resolve, reject) => {
            try {
                let privKey = await this.getCredentials().getPrivateKey();
                return resolve(privKey);
            } catch (e) {
                return reject(e);
            }
        })
    }

    getCurrentBalance() {
        return new Promise(async (resolve, reject) => {
            try {
                let address = await this.getAddress();
                let balance = await this.getBalance(address);
                return resolve(balance);
            } catch (e) {
                return reject(e);
            }
        })
    }

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