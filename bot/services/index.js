const
  fs = require('fs'),
  _ = require('lodash'),
  comments = require('parse-comments'),
  recurRead = require('recursive-readdir-sync'),
  services = {};


let files = recurRead('./services');
_.remove(files, file => file === 'services/index.js');

files.forEach(file => {
  const data = fs.readFileSync(file, 'utf-8');
  const name = comments(data)[0].service;
  services[`$${name}`] = require(`${process.cwd()}/${file}`);
});

module.exports = services;