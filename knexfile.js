// Update with your config settings.
require('dotenv').config()
const { resolve } = require('path')

const { env } = process
module.exports = {
  
  client: env.DB_CONNECTION || 'sqlite3',
  connection: {
    filename: resolve('.', env.DB_DIRNAME, env.DB_DATABASE || './dev.sqlite3')
  },
  migrations: {
    directory: resolve('.', env.DB_DIRNAME, 'migrations')
  },
  seeds: {
    directory: resolve('.', env.DB_DIRNAME, 'seeds')
  }
};
