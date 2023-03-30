const { Router } = require('express');
const findByAddress = require('../service/ApiTxsFindByAddress.service')
const router = Router();

router.get('/txs', findByAddress);

module.exports = router