const
  cron = require('node-cron');
  // Discord = require('discord.js'),
  // client = new Discord.Client();

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

  register(message) {
    console.log(message)
  }
}

module.exports = new Methods();