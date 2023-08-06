const BtcBlockCypherProvider = require('/src/core/blockchain/btc/BlockcypherProvider');
const LTC_PROVIDER_URL_MAIN = "https://api.blockcypher.com/v1/ltc";
const NETWORK_MAIN = 'main';

class LtcBlockcypherProvider extends BtcBlockCypherProvider {
    _getProviderUrl() {
        return LTC_PROVIDER_URL_MAIN;
    }

    _getNetworkUrl() {
        return NETWORK_MAIN;
    }
}
module.exports = LtcBlockcypherProvider;
