const
  Discord = require('discord.js'),
  methods = require('./methods'),
  onReaction = require('./methods/onReaction'),
  { token } = require('./config'),
  chalk = require('chalk');

/**
 * @todo Finish migrating old commands to Commando commands
 */
// client.on('message', message => {
//   if (message.content.startsWith('?')) {
//     let command = message.content.split(' ')[0].slice(1).toLowerCase();
//     try {
//       methods[command](message);
//     } catch(e) {}
//   }
// });

const
	path = require('path'),
	Commando = require('discord.js-commando'),
	client = new Commando.Client({
		commandPrefix: '?',
		owner: '120602141537599488'
	});


client.registry
	// Registers your custom command groups
	.registerGroups([
		['summoners', 'Commandes liées aux joueurs League of Legends'],
	])

	// Registers all built-in groups, commands, and argument types
	.registerDefaults()

	// Registers all of your commands in the ./commands/ directory
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
	console.log(chalk.magenta(`Logged in as ${client.user.tag}`));
	client.user.setActivity('In development ...');
});

client.on('error', console.error);

client.on('messageReactionAdd', (reaction, user) => {
  if (reaction.message.author.id == client.user.id) {
    onReaction(reaction, user);
  }
});

client.login(process.env.TOKEN || token);