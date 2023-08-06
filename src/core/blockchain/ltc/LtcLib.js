const BtcLib = require('/src/core/blockchain/btc/BtcLib');
const LtcBlockCypherProvider = require('./LtcBlockcypherProvider');
const LtcValidator = require('/src/core/validators/blockchain/LtcValidator')
const LtcConverter = require('/src/core/helpers/LtcConverter');
const LTC_NETWORK_MAIN = require('/src/core/blockchain/ltc/LtcNetworks')["main"];

class LtcLib extends BtcLib {
    constructor(app) {
        super(app);
        this.validator = new LtcValidator();
        this.converter = new LtcConverter();
        this.provider = new LtcBlockCypherProvider(app, this.validator, this.converter);
    }

    _getNetwork() {
        return LTC_NETWORK_MAIN;
    }
}

module.exports = LtcLib;