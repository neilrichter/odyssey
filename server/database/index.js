const config = require.main.require('./config');
const knex = require('knex')({
  client: 'pg',
  connection: {
    ...config.db
  }
});

module.exports = knex;