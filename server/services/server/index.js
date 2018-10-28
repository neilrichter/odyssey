const
  chalk = require('chalk'), 
  { exec } = require('child_process'),
  $db = require.main.require('./database');

const errors = {
  'ECONNREFUSED': cb => {
    console.log(chalk.red('Start the Postgresql server'));
  }, 
  '3D000': cb => {
    console.log(chalk.red('Database "odyssey" does not exist, creating it...'));
    const creation = exec('createdb odyssey');
    creation.on('close', (code, signal) => {
      cb();
    })
  },
  '42P01': cb => {
    console.log(chalk.red('Tournaments database is not existing, creating it...'));
    const migration = exec('knex --knexfile ./database/knexfile.js migrate:latest;', (err, stdout, stdin) => console.log(chalk.cyan(stdout)));
    migration.on('close', (code, signal) => {
      cb();
    })
  }
}

const callback = () => {
  $db
    .select('*')
    .from('tournaments')
    .then(results => console.log(chalk.magenta('Server started')))
    .catch(async err => {
      errors[err.code](callback);
    });
}

class Server {
  checkDatabase() {
    callback();
  }
}

module.exports = new Server();