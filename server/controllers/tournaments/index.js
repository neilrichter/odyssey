const
  express = require('express'),
  app = express.Router();

/**
 * Tournaments controller
 */
app.get('/', (req, res, next) => {
  res.status(200).send('Hello world');
});

module.exports = app;