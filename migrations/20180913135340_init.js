exports.up = function (knex, Promise) {
  return knex.schema
    .createTable('users', table => {
      table.uuid('id').unique().primary().notNullable()
      table.string('name').notNullable()
      table.string('email').unique().notNullable()
      table.string('password').notNullable()
      table.string('rating')
      table.timestamps()
    })
    .createTable('championships', table => {
      table.uuid('id').unique().primary().notNullable()
      table.string('name')
      table.timestamps()
    })
    .createTable('championships_users', table => {
      table.increments('id').unique().primary().notNullable()
      table.uuid('championship_id').notNullable()
      table.uuid('user_id').notNullable()
      table.foreign('championship_id').references('id').inTable('championships')
      table.foreign('user_id').references('id').inTable('users')
      table.timestamps()
    })

    .createTable('matches', table => {
      table.uuid('id').unique().primary().notNullable()
      table.uuid('winner_id')
      table.foreign('winner_id').references('id').inTable('users')
      table.string('score_1').defaultTo('0 x 0')
      table.string('score_2').defaultTo('0 x 0')
      table.boolean('finished').defaultTo('false')
      table.uuid('championship_id').notNullable()
      table.foreign('championship_id').references('id').inTable('championships')
      table.timestamps()
    })
    .createTable('matches_users', table => {
      table.increments('id').unique().primary().notNullable()
      table.uuid('match_id').notNullable()
      table.uuid('user_id').notNullable()
      table.foreign('match_id').references('id').inTable('matches')
      table.foreign('user_id').references('id').inTable('users')
      table.timestamps()
    })
}

exports.down = function (knex, Promise) {
  return knex.schema
    .dropTableIfExists('matches_users')
    .dropTableIfExists('matches')
    .dropTableIfExists('championships_users')
    .dropTableIfExists('championships')
    .dropTableIfExists('users')
}
