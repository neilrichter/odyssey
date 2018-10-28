
exports.up = function(knex, Promise) {
  return knex.schema.hasTable('tournaments')
    .then(exists => {
      if (!exists) {
        return knex.schema.createTable('tournaments', table => {
          table.increments('id');
          table.integer('size');
          table.timestamp('created_at').defaultTo(knex.fn.now());
        });
      }
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('tournaments');
};
