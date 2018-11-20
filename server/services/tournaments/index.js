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
			.then(row => 201)
			.catch(err => 500);
	}
}

module.exports = new Tournaments();