const ApiResponseClass = require('../libs/ApiResponseClass');
const etherscanDao = require('../dao/EtherscanDao');
const puppeteer = require('puppeteer');

/**
 * 接口 /api/txs : 校验并转换请求参数
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @author Andy
 */
function findByAddressValidator(req, res, next) {
    const { a, page, pageSize } = req.query;

    if (a == null) {
        const apiRes = new ApiResponseClass();
        // 暂定 该接口参数http业务异常编码
        apiRes.code = 10001
        apiRes.msg = '参数 a 不应为空'
        res.json(apiRes);
    } else if (typeof a !== "string") {
        const apiRes = new ApiResponseClass();
        // 暂定 该接口参数http业务异常编码
        apiRes.code = 10001
        apiRes.msg = '参数 a 应为为字符串'
        res.json(apiRes);
    } else if (a.length !== 42) {
        const apiRes = new ApiResponseClass();
        // 暂定 该接口参数http业务异常编码
        apiRes.code = 10001
        apiRes.msg = '参数 a 长度不符合要求'
        res.json(apiRes);
    } else {
        if (typeof page !== 'number') {
            req.query.page = 1;
        }

        if (typeof pageSize !== 'number') {
            req.query.pageSize = 50;
        }

        next();
    }
}

/**
 * 查询指定用户的交易历史记录
 * @param {*} req 
 * @param {*} res 
 * @author Andy
 */
async function findByAddress(req, res) {
    const { a, page, pageSize } = req.query;
    const apiRes = new ApiResponseClass();

    try {
        let list = await etherscanDao.paginationQuery(
            { address: a },
            page,
            pageSize
        );

        if (list.length === 0) {
            etherscanCrawler(a, page)
            apiRes.data = `正在获取数据请稍后查询`;
        } else {
            apiRes.data = list;
        }
        res.json(apiRes);
    } catch (e) {
        console.error(`接口 /api/txs | 参数 a ${a} page ${page} | 出错 ${e.stack}`);
        apiRes.code = 500
        apiRes.msg = "Server Error"
        res.json(apiRes);
    }
}

/**
 * 爬取指定地址的交易记录
 * @param {string} address    地址
 * @param {number} targetPage 指定页数 默认 1
 * @param {*} page 浏览器实例
 * @description 首次调用时返回第一页数据
 */
async function etherscanCrawler(address, targetPage, page, browser) {
    const list = [];

    try {
        if (!page) {
            // 1. 打开浏览器
            browser = await puppeteer.launch({
                headless: false
            });

            // 2. 新建一个标签页
            page = await browser.newPage();
        }

        // 3. 输入地址敲回车
        await page.goto(targetPage === 1 ? `https://etherscan.io/txs?a=${address}` : `https://etherscan.io/txs?a=${address}&p=${targetPage}`);

        await page.waitForTimeout(5000);

        await page.waitForSelector("#ContentPlaceHolder1_divTransactions > div.table-responsive > table > tbody > tr");

        // 4. 操作：
        const totalPage = await page.$eval(`#ContentPlaceHolder1_divDataInfo > div > div.d-flex.flex-wrap.align-items-center.justify-content-between.gap-2 > nav > ul > li:nth-child(3) > span`, elem => elem.innerHTML.split(' ').pop());

        const dataLen = await page.$$eval("#ContentPlaceHolder1_divTransactions > div.table-responsive > table > tbody > tr", elems => elems.length);

        for (let i = 1; i <= dataLen; i++) {
            const txHash = await page.$eval(`#ContentPlaceHolder1_divTransactions > div.table-responsive > table > tbody > tr:nth-child(${i}) > td:nth-child(2) > div > span > a`, elem => elem.innerText);

            const BlockNumber = await page.$eval(`#ContentPlaceHolder1_divTransactions > div.table-responsive > table > tbody > tr:nth-child(${i}) > td:nth-child(4) > a`, elem => elem.innerText);

            const Time = await page.$eval(`#ContentPlaceHolder1_divTransactions > div.table-responsive > table > tbody > tr:nth-child(${i}) > td.showDate > span`, elem => elem.innerText);

            // > span : 需模拟用户点击复制按钮，获取剪切板的值
            const From = await page.$eval(`#ContentPlaceHolder1_divTransactions > div.table-responsive > table > tbody > tr:nth-child(${i}) > td:nth-child(8) > div`, elem => elem.innerText);

            // > a:nth-child(2) : 需模拟用户点击复制按钮，获取剪切板的值
            const To = await page.$eval(`#ContentPlaceHolder1_divTransactions > div.table-responsive > table > tbody > tr:nth-child(${i}) > td:nth-child(10) > div`, elem => elem.innerText).catch(e => e.stack);

            const Value = await page.$eval(`#ContentPlaceHolder1_divTransactions > div.table-responsive > table > tbody > tr:nth-child(${i}) > td:nth-child(11) > span`, elem => elem.innerText);

            const TxFee = await page.$eval(`#ContentPlaceHolder1_divTransactions > div.table-responsive > table > tbody > tr:nth-child(${i}) > td.small.text-muted.showTxnFee`, elem => elem.innerText.replace('<b>', ''));

            list.push({
                txHash,
                BlockNumber,
                Time,
                From,
                To,
                Value,
                TxFee
            })
        }

        await etherscanDao.insertOne(list.map(info => ({ address, ...info })));
        if (targetPage === 1) {
            // 不添加语法糖 await
            etherscanCrawler(address, targetPage + 1, page, browser);
            return list;
        }

        if (targetPage < totalPage) {
            // 不添加语法糖 await
            etherscanCrawler(address, targetPage + 1, page, browser);
            return;
        }

        browser.close();

        console.log(`地址 ${address} | 共 ${totalPage} 页 | 爬取完毕`);
    } catch (e) {
        console.error(e.stack)
    }
}

module.exports = { findByAddressValidator, findByAddress };