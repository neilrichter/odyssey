const
  Discord = require('discord.js'),
  client = new Discord.Client(),
  methods = require('./methods'),
  { token } = require('./config'),
  chalk = require('chalk');

client.on('ready', () => {
  console.log(chalk.magenta(`Logged in as ${client.user.tag}`));
});

client.on('message', message => {
  if (message.content.startsWith('?')) {
    let command = message.content.split(' ')[0].slice(1).toLowerCase();

    methods[command](message);
  }
});

client.login(token);