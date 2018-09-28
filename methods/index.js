const
  Discord = require('discord.js'),
  client = new Discord.Client();

class Methods {
  async flood(message) {
    const count = message.content.split(' ')[1]
    for (let i = 0; i < count; i++) {
      message.channel.send(i);
    }
  }

  async clear(message) {
    message.channel.fetchMessages({limit: 200})
      .then(async messages => {
        await message.channel.bulkDelete(messages)
        if (messages.size === 200) {
          this.clear(message);
        }
      })
      .catch(err => console.log(err));
  }
}

module.exports = new Methods();