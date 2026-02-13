const express = require('express');

const connect = require('./schemas');
const indexRouter = require('./routes/index');
const photosRouter = require('./routes/photos');

const app = express();
const port = 3000;
connect();

app.use(express.static('.'))

app.use('/', indexRouter);
app.use('/photos', photosRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
