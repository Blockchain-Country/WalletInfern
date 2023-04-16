const BtcWallet = require('./BtcWallet');
const LTC_NETWORK = require('/src/core/blockchain/ltc/LtcNetworks')["main"];
const DERIVATION_PATH = "m/44'/2'/0'/0/0"

class LtcWallet extends BtcWallet {

    _getDerivationPath() {
        return DERIVATION_PATH;
    }

    _getNetwork() {
        return LTC_NETWORK;
    }

}

module.exports = LtcWallet;