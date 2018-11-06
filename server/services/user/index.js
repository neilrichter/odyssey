/**
 * @service user
 */

const
	$db = require.main.require('./database');

const getRandomInt = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

class User {
	isVerified(discord_id) {
		return $db
			.select('*')
			.from('users')
			.where({ discord_id, verified: true })
			.first()
			.then(result => result ? {
				user: result,
				status: 204
			} : {
				user: false,
				status: 404
			})
			.catch(err => console.log(err));
	}

	isVerifying(discord_id, summoner_name) {
		return $db
			.select('*')
			.from('users')
			.where({ discord_id, verified: false, summoner_name })
			.andWhere('step', '>=', 1)
			.first()
			.then(result => result)
			.catch(err => console.log(err));
	}

	async startVerification(discord_id, summoner) {
		const exists = await $db
			.select('*')
			.from('users')
			.where({ discord_id })
			.first()
			.then(row => row ? true : false)
			.catch(err => console.log(err));

		const query = $db('users');
		if (exists) {
			query.update({ summoner_name: summoner.name });
		} else {
			query.insert({
				discord_id,
				summoner_name: summoner.name,
				summoner_id: summoner.id,
				step: 1,
				verified: false,
				old_icon: summoner.profileIconId,
				new_icon: getRandomInt(0, 28)
			});
		}
		return query
			.returning('id')
			.get(0)
			.then(id => {
				return $db
					.select('*')
					.from('users')
					.where({ id })
					.first()
					.then(updated => ({
						user: updated,
						status: 201
					}))
					.catch(err => console.log(err));
			})
			.catch(err => console.log(err));
	}

	verify(discord_id, summoner) {
		return $db
			.select('*')
			.from('users')
			.where({ discord_id })
			.first()
			.then(row => {
				if (row.new_icon === summoner.profileIconId) {
					return $db('users')
						.update({ verified: true })
						.where({ discord_id })
						.returning('id')
						.get(0)
						.then(id => {
							return $db
								.select('*')
								.from('users')
								.where({ id: id})
								.first()
								.then(updated => ({
									user: updated,
									status: 200
								}))
								.catch(err => console.log(err));
						})
						.catch(err => console.log(er));
				} else {
					return {
						user: row,
						status: 401
					};
				}
			})
			.catch(err => console.log(err));
	}
}

module.exports = new User();