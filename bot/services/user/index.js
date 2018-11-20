/**
 * @service user
 */

const
	config = require.main.require('./config'),
	axios = require('axios');

class User {
	hasRole(guild, user) {
		return guild.fetchMember(user.id)
			.then(member => member.id == '120602141537599488' || member.roles.find(role => role.id == '491093830062440451'))
			.catch(err => console.log(err));
	}

	async isVerified(discord_id) {
		console.log(discord_id);
		return await axios.get(`${config.server}/users/is-verified`, {
			params: {
				discord_id
			}
		})
			.then(res => res.data)
			.catch(err => console.log(err));
	}
}

module.exports = new User();