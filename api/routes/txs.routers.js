const { Router } = require('express');
const { findByAddress, findByAddressValidator } = require('../service/ApiTxsFindByAddress.service')
const router = Router();

router.get('/txs', findByAddressValidator, findByAddress);

module.exports = router