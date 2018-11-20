const
	axios = require('axios'),
	{ $user } = require.main.require('./services'),
	Discord = require('discord.js');

module.exports = async (reaction, user) => {
	if (reaction.message.embeds[0].hexColor == "#8759b0") {
		await console.log($user.isVerified(user.id));
	}
}