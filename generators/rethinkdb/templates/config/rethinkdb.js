/**
 Load env vars from .env file
 */
const rethinkConfig = {
  authKey: env.string('RETHINKDB_AUTHKEY', ''),
  bufferSize: env.int('RETHINKDB_BUFFER_SIZE', null),
  db: env.string('RETHINKDB_DATABASE'),
  host: env.string('RETHINKDB_HOST'),
  max: env.int('RETHINKDB_MAX', null),
  min: env.int('RETHINKDB_MIN', null),
  password: env.string('RETHINKDB_USER_PASSWORD', ''),
  port: env.int('RETHINKDB_PORT'),
  ssl: {
    ca: env.string('RETHINKDB_SSL_CA', '')
  },
  timeoutError: env.int('RETHINKDB_TIMEOUT_ERROR', 5000),
  timeoutGb: env.int('RETHINKDB_TIMEOUT_GB', null),
  user: env.string('RETHINKDB_USER', ''),
  usersTable: env.string('RETHINKDB_USERS_TABLE', ''),
  credentialsTable: env.string('RETHINKDB_CREDENTIALS_TABLE', ''),
  invitationsTable: env.string('RETHINKDB_INVITATIONS_TABLE', 'invitations'),
  invitationsTableOrderingIndex: env.string('RETHINKDB_INVITATIONS_TABLE_ORDERING_INDEX', 'invitations_ordering_index'),
  chartsTable: env.string('RETHINKDB_CHARTS_TABLE', '')
};

if (rethinkConfig.authKey === '') {
  delete rethinkConfig.authKey;
}
if (rethinkConfig.user === '') {
  delete rethinkConfig.user;
  delete rethinkConfig.password;
}
if (rethinkConfig.ssl.ca === '') {
  delete rethinkConfig.ssl;
}

module.exports = rethinkConfig;
