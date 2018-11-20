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

    let status;
    try {
      status = await axios.post(`${config.server}/tournaments/create`, {
        size: parseInt(size),
        name
      })
        .then(response => response.status)
        .catch(err => console.log(err));
      if (status === 201) {
        const embed = new Discord.RichEmbed();
        embed.setTitle(name);
        embed.setDescription(`${message.author.username} a créé le tournoi ${name} !\n
        Réagissez avec l'emoji :white_check_mark: sur ce message pour vous inscrire.`);
        embed.addField(':warning: Attention :warning:', 'Seul les comptes vérifiés peuvent s\'inscrire.')
        embed.addField('Comment vérifier son compte ?', 'Envoyez `?verify nomdinvocateur` dans un channel destiné aux commandes de bot et suivez les instructions.');
        embed.setColor('#8759b0');
        await message.delete();
        message.channel.send(embed);
      }
    } catch(e) {
      console.log(e);
    }
  }

  register(message) {
    console.log(message)
  }
}

module.exports = new Methods();