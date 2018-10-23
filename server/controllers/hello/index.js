const
  express = require('express'),
  app = express.Router();

let token = {};

/**
 * Returns information about the current user.
 */
app.get('/', (req, res, next) => {
  res.status(200).send('Hello world');
});

module.exports = app;