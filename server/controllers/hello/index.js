const
  express = require('express'),
  app = express.Router();

/**
 * First controller test
 */
app.get('/', (req, res, next) => {
  res.status(200).send('Hello world');
});

module.exports = app;