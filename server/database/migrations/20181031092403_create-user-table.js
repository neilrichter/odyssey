
exports.up = function(knex, Promise) {
  return knex.schema.hasTable('users')
    .then(exists => {
      if (!exists) {
        return knex.schema.createTable('users', table => {
          table.increments('id');
					table.bigInteger('discord_id');
					table.string('summoner_name');
					table.bigInteger('summoner_id');
					table.integer('step');
					table.boolean('verified');
					table.integer('old_icon');
					table.integer('new_icon')
					table.timestamps(false, true);
        });
      }
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
