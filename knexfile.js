module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://postgres:admin@localhost:5432/db_ranking'
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  },
  test: {
    client: 'pg',
    connection: 'postgres://postgres:admin@localhost:5432/db_ranking'
  }
}
