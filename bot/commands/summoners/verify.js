const
  config = require.main.require('./config'),
  axios = require('axios'),
	Discord = require('discord.js'),
  { Command } = require('discord.js-commando');
  
console.log(config);

module.exports = class VerifyCommand extends Command {
	constructor(client) {
			super(client, {
					name: 'verify',
					group: 'summoners',
					memberName: 'verify',
          description: 'Vérifie un compte Discord associé à un invocateur. `?verify <nomdinvocateur>`',
          args: [
            {
              key: 'summonerName',
              prompt: 'Veuillez entrer votre nom d\'invocateur afin de vérifier votre compte.',
              type: 'string'
            }
          ]
			});
	}

  /**
   * Verifies a user according to its summoner name
   * @param {string} summonerName - Summoner Name (prompted by the bot)
   */
	async run(message, {
    summonerName
  }) {
    let data = {};
    try {
      data = await axios.post(`${config.server}/summoners/verify`, {
        discordId: message.author.id,
        summonerName
      })
      .then(response => ({
        user: response.data,
        status: response.status
      }))
    } catch (err) {
      data = {
        user: err.response.data,
        status: err.response.status
      };
    }
    const { user, status } = data;
    const embed = new Discord.RichEmbed();

    switch (status) {
      case 200:
        embed.setTitle('Validation de vérification du compte');
        embed.setThumbnail(`${config.localtunnel}/img/profile_icons/${user.old_icon}.png`);
        embed.setDescription(`Félicitations, ton compte **${user.summoner_name}** a bien été validé.
        Tu peux désormais t'inscrire aux tournois de la communauté !\n Tu peux remettre ton ancien icône si tu le désires`);
        break;

      case 201:
        embed.setTitle('Vérification de compte League of Legends');
        embed.setThumbnail(`${config.localtunnel}/img/profile_icons/${user.old_icon}.png`);
        embed.setDescription(`Bonjour ${message.author.username}, tu as demandé une vérification de ton compte League of Legends **${user.summoner_name}**`);
        embed.addField('Comment vérifier mon compte ?', `Remplace ton icône par celui juste en dessous, puis envoie\n\`?verify ${user.summoner_name}\` ici.`);
        console.log(`${config.localtunnel}/img/profile_icons/${user.new_icon}.png`)
        embed.setImage(`${config.localtunnel}/img/profile_icons/${user.new_icon}.png`);
        break;

      case 204:
        embed.setTitle('Vérification de compte League of Legends');
        embed.setThumbnail(`${config.localtunnel}/img/profile_icons/${user.old_icon}.png`);
        embed.setDescription(`Bonjour ${message.author.username}, ton compte est déjà lié à un compte League of Legends.`);
        embed.addField('Que faire ?', 'Si tu as besoin de poser une question ou obtenir de l\'aide, envoie un message à <@120602141537599488>.');
        break;

      case 401:
        embed.setTitle('Echec de la vérification de compte League of Legends');
        embed.setDescription(`L'icône du compte **${user.summoner_name}** ne correspond pas à celui que tu dois mettre pour vérifier ton compte.
        \nRemplace l'icône de ton compte par celui ci-dessous, puis envoie\n\`?verify ${user.summoner_name}\` ici.`);
        embed.setThumbnail(`${config.localtunnel}/img/profile_icons/${user.old_icon}.png`);
        embed.setImage(`${config.localtunnel}/img/profile_icons/${user.new_icon}.png`);
        break;

      case 404:
        embed.setTitle('Echec de la vérification de compte League of Legends');
        embed.setDescription(`Le nom d'invocateur **${summonerName}** n'a pas été trouvé.`);
        break;
    }
    embed.setColor('#8758B0');
		return message.author.send(embed);
	}
};