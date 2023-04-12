const AbstractCurrencyWallet = require('/src/core/blockchain/credentials/protocols/AbstractCurrencyWallet');
const bitcoin = require("bitcoinjs-lib");
const bip39 = require("bip39");
const privKeyToAddressETH = require('ethereum-private-key-to-address');

class EthWallet extends AbstractCurrencyWallet{
    provideAddress(mnemonic) {
        return new Promise(async(resolve,reject)=>{
            try {
                console.log("EthWallet provideAddress",mnemonic);
                const privateKey = await this.providePrivateKey(mnemonic);
                const address = privKeyToAddressETH(privateKey);
                return resolve(address);
            } catch (e) {
                return reject(e);
            }
        })
    }
    providePrivateKey(mnemonic) {
        return new Promise(async(resolve,reject)=>{
            try {
                const seed = await bip39.mnemonicToSeed(mnemonic);
                console.log("EthWallet providePrivateKey", seed)
                const node = bitcoin.bip32.fromSeed(seed);
                console.log("EthWallet providePrivateKey after fromSeed")
                const child = node.derivePath(`m/44'/60'/0'/0/0`);
                const privateKey = child.privateKey.toString('hex');
                return resolve(privateKey);
            } catch (e) {
                return reject(e);
            }
        })
    }
}

module.exports=EthWallet;