const AbstractCurrencyWallet = require('/src/core/blockchain/credentials/protocols/AbstractCurrencyWallet');
const {payments, networks} = require('bitcoinjs-lib');
const NETWORK_TEST = networks.testnet;
const DERIVATION_PATH_TEST = "m/44'/1'/0'/0/0"
const bip39 = require("bip39");
const bitcoin = require("bitcoinjs-lib");

class BtcWallet extends AbstractCurrencyWallet {

    _getDerivationPath() {
        return DERIVATION_PATH_TEST;
    }

    _getNetwork() {
        return NETWORK_TEST;
    }

    provideAddress(mnemonic) {
        return new Promise(async (resolve, reject) => {
            try {
                const seed = await bip39.mnemonicToSeed(mnemonic);
                const root = bitcoin.bip32.fromSeed(seed, this._getNetwork());
                const child = root.derivePath(this._getDerivationPath());
                const {address} = payments.p2pkh({pubkey: child.publicKey, network: this._getNetwork()});
                return resolve(address);
            } catch (e) {
                return reject(e);
            }
        })
    }

    providePrivateKey(mnemonic) {
        return new Promise(async (resolve, reject) => {
            try {
                const seed = await bip39.mnemonicToSeed(mnemonic);
                const root = bitcoin.bip32.fromSeed(seed, this._getNetwork());
                const child = root.derivePath(this._getDerivationPath());
                const privateKey = child.toWIF();
                return resolve(privateKey);
            } catch (e) {
                return reject(e)
            }
        })
    }

}

module.exports = BtcWallet;