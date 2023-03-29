const express = require('express');
const indexRouter = require('./routes/index.routes')
const txsRouter = require('./routes/txs.routers')
const app = express();

const port = process.env.BLOCKLET_PORT || process.env.PORT || 3030;

app.use('/', indexRouter);
app.use('/api', txsRouter);

app.listen(port, () => {
  console.log(`Blocklet app listening on port ${port}`);
});
