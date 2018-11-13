
exports.up = function(knex, Promise) {
	knex.schema.dropTableIfExists('tournaments');
	return knex.schema.hasTable('tournaments').then(exists => {
		if (!exists) {
			return knex.schema.createTable('tournaments', function(table) {
				table.increments('id')
				table.string('name');
				table.integer('size');
				table.boolean('has_started');
				table.timestamps(false, true);
			});
		}
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTableIfExists('tournaments');
};
