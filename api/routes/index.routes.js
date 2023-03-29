const { Router } = require('express');
const env = require('../libs/env');
const router = Router();

router.get('/', (req, res) => {
    res.send(`
  <div style="display:flex;flex-direction:column;align-items:center;padding:64px 0;">
  <h1 style="margin:64px 0;">
    <span style="display:inline-block;padding:8px 24px;background:#1dc1c7;color:#fff;">Blocklet</span>
    <span style="color:#777;">+ Express</span>
  </h1>
  <pre>
  ${JSON.stringify(env, null, 2)}
  </pre>
  </div>
    `);
});

router.get('/test',(req,res)=>{
  res.send("123")
})

module.exports = router