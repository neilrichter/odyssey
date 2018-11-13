/**
 * @service user
 */

class User {
	hasRole(guild, user) {
		return guild.fetchMember(user.id)
			.then(member => member.id == '120602141537599488' || member.roles.find(role => role.id == '491093830062440451'))
			.catch(err => console.log(err));
	}
}

module.exports = new User();