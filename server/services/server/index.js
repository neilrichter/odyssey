/**
 * @service server
 */

const
  chalk = require('chalk'), 
  { exec } = require('child_process'),
  fs = require('fs'),
  Path = require('path'),
  axios = require('axios'),
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

/**
 * Recursive callback to check after the action if app is runnable
 */
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
  /**
   * Checks that the database is running correctly to make the app run
   */
  checkDatabase() {
    callback();
  }

  /**
   * Downloads a file and puts it in the given directory
   * @async
   * @param {string} url - File url online
   * @param {string} location - Path to location locally
   * @param {string} name - Downloaded file name
   * @param {string} extension - File extension
   * 
   * @returns {Promise<string>} Entire path to file local location
   */
  async download(url, location, name, extension) {
    const path = Path.format({
      dir: Path.resolve(process.cwd(), ...location.split('/')),
      base: `${name}.${extension}`
    });
  
    const { data } = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream'
    })
  
    data.pipe(fs.createWriteStream(path))
  
    return new Promise((resolve, reject) => {
      data.on('end', () => {
        resolve(path);
      })
  
      data.on('error', err => {
        reject()
      })
    })
  }
}

module.exports = new Server();