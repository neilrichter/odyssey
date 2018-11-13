const
  axios = require('axios'),
  config = require.main.require('./config'),
  { $user } = require.main.require('./services'),
  Discord = require('discord.js'),
  cron = require('node-cron');

class Methods {
  flood(message) {
    const count = message.content.split(' ')[1]
    for (let i = 0; i < count; i++) {
      message.channel.send(i);
    }
  }

  clear(message) {
    message.channel.fetchMessages({limit: 25})
      .then(async messages => {
        await message.channel.bulkDelete(messages);
        if (messages.size === 200) {
          this.clear(message);
        }
      })
      .catch(err => console.log(err));
  }

  startcron(message) {
    cron.schedule('*/10 * * * * *', () => {
      this.clear(message);
    });
  }

  async create(message) {
    if (!await $user.hasRole(message.channel.guild, message.author)) return;

    const sizeFlag = new RegExp(/--size=[0-9]+/);
    let size = sizeFlag.exec(message.content);

    if (size) {
      size = size[0].split('=')[1];
    }

    let name = message.content.split('?create ')[1];
    name =  name.replace(/\s--[a-zA-Z]+=.+/g, '');

    let data = {};
    try {
      data = await axios.post(`${config.server}/tournaments/create`, {
        size: parseInt(size),
        name
      })
        .then(response => response.data)
        .catch(err => console.log(err));
    } catch(e) {
      console.log(e);
    }
  }

  register(message) {
    console.log(message)
  }

  /**
   * Verifies a user according to its summoner name
   * @example `?verify summonername`
   * @param {Message} message - Messoge object
   */
  async verify(message) {
    const summonerName = message.content.split(' ').slice(1).join(' ');
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
        embed.setDescription(`Félicitations, ton compte **${summonerName}** a bien été validé.
        Tu peux désormais t'inscrire aux tournois de la communauté !\n Tu peux remettre ton ancien icône si tu le désires`);
        break;

      case 201:
        embed.setTitle('Vérification de compte League of Legends');
        embed.setThumbnail(`${config.localtunnel}/img/profile_icons/${user.old_icon}.png`);
        embed.setDescription(`Bonjour ${message.author.username}, tu as demandé une vérification de ton compte League of Legends **${summonerName}**`);
        embed.addField('Comment vérifier mon compte ?', `Remplace ton icône par celui juste en dessous, puis envoie\n\`?verify ${summonerName}\` ici.`);
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
        embed.setDescription(`L'icône du compte **${summonerName}** ne correspond pas à celui que tu dois mettre pour vérifier ton compte.
        \nRemplace l'icône de ton compte par celui ci-dessous, puis envoie\n\`?verify ${summonerName}\` ici.`);
        embed.setThumbnail(`${config.localtunnel}/img/profile_icons/${user.old_icon}.png`);
        embed.setImage(`${config.localtunnel}/img/profile_icons/${user.new_icon}.png`);
        break;

      case 404:
        embed.setTitle('Echec de la vérification de compte League of Legends');
        embed.setDescription(`Le nom d'invocateur **${summonerName}** n'a pas été trouvé.`);
        break;
    }
    embed.setColor('#8758B0');
    message.author.send(embed);
  }
}

module.exports = new Methods();