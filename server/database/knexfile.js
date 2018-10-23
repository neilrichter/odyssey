// Update with your config settings.

const config = require('../config');

module.exports = {
  client: 'pg',
  connection: {
    ...config.db
  }
};
