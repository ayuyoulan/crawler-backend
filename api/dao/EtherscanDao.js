const IDataBase = require('./libs/IDataBase');

class EtherscanDao extends IDataBase {
    constructor(databasename) {
        super(databasename);
    }

    async paginationQuery(params, page, pageSize) {
        try {
            const list = await this.db
                .cursor(params)
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .exec();
            return list
        } catch (e) {
            console.log(`表 ${this.databasename} | 函数 paginationQuery 分页查询出错 ${e.stack}`);
            return []
        }
    }
}

module.exports = new EtherscanDao("etherscan");