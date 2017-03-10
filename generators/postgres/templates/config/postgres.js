module.exports = {
  client: 'postgres',
  connection: {
    host: env.string('POSTGRES_HOST'),
    user: env.string('POSTGRES_USER'),
    password: env.string('POSTGRES_PASSWORD'),
    database: env.string('POSTGRES_DB'),
    ssl: env.bool('POSTGRES_SSL', false)
  },
  pool: {
    min: 1,
    max: 7
  }
};
