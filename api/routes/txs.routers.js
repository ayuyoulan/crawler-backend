const { Router } = require('express');
const router = Router();

router.get('/txs', (req, res) => {
    res.json({
        data: "123"
    });
});

module.exports = router