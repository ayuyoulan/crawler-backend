const IDataBase = require('./libs/IDataBase');

class EtherscanDao extends IDataBase {
    constructor(databasename) {
        super(databasename);
    }
}

module.exports = new EtherscanDao("etherscan");