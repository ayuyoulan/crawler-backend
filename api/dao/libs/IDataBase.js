const { Database } = require('@blocklet/sdk');

class IDataBase {

    constructor(databasename) {
        if (typeof databasename !== "string" && databasename.length === 0) {
            throw new Error(`数据库 | 表 必须包含名称且为中文 | databasename :${databasename}`);
        }

        this.databaseName = databasename;

        this.db = new Database(databasename);
    }

    async insertOne(params) {
        try {
            const inserted = await this.db.insert(params);
            return inserted;
        } catch (e) {
            console.error(`数据库 | 表 ${this.databaseName} | insertOne | 参数 ${params} | 出错 ${e.stack} `);
        }
    }

    async find(params) {
        try {
            const list = await this.db.find(params);
            return list;
        } catch (e) {
            console.error(`数据库 | 表 ${this.databaseName} | find | 参数 ${params} | 出错 ${e.stack} `);
            return [];
        }
    }
}

module.exports = IDataBase;