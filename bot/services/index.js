const
  fs = require('fs'),
  _ = require('lodash'),
  services = {};

let folders = fs.readdirSync('./services');
_.remove(folders, item => _.includes(['index.js'], item));
_.forEach(folders, folder => {
  services[`$${folder}`] = require(`./${folder}`);
});

module.exports = services;