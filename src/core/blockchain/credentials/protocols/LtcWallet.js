const BtcWallet = require('./BtcWallet');
const LTC_NETWORK_MAIN = require('/src/core/blockchain/ltc/LtcNetworks')["main"];
const DERIVATION_PATH_MAIN = "m/44'/2'/0'/0/0"

class LtcWallet extends BtcWallet {

    _getDerivationPath() {
        return DERIVATION_PATH_MAIN;
    }

    _getNetwork() {
        return LTC_NETWORK_MAIN;
    }
}

module.exports = LtcWallet;