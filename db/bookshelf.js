import config from '../knexfile'
const environment = process.env.NODE_ENV || 'development'
const knex = require('knex')(config[environment])
const bookshelf = require('bookshelf')(knex)

bookshelf.plugin(require('bookshelf-uuid'))

export default bookshelf
