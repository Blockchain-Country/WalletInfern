const EthLib = require('/src/core/blockchain/eth/EthLib');
const BnbValidator = require('/src/core/validators/blockchain/BnbValidator')
const BnbConverter = require('/src/core/helpers/BnbConverter');
const Web3 = require("web3");
const BNB_PROVIDER_URL = process.env.BNB_PROVIDER_URL;
const CHAIN_ID_TEST = 97;

class BnbLib extends EthLib {
    constructor(app) {
        super(app);
        this.validator = new BnbValidator();
        this.converter = new BnbConverter();
        this.provider = new Web3(new Web3.providers.HttpProvider(BNB_PROVIDER_URL));
    }

    _getChainId() {
        return CHAIN_ID_TEST;
    }
}

module.exports = BnbLib;