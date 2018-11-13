/**
 * @service tournaments
 */

const
	$db = require.main.require('./database');

class Tournaments {
	create(data) {
		return $db
			.insert(data)
			.into('tournaments')
			.then(row => ({ code: 201 }))
			.catch(err => ({ code: 500 }));
	}
}

module.exports = new Tournaments();