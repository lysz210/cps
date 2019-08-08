require('dotenv').config()
require('ts-node').register({
  compilerOptions: {
    module: 'commonjs'
  }
})
// injext .env

const { resolve } = require('path')

// Update with your config settings.
const { env } = process
console.log(env)
module.exports = {
  client: env.DB_CONNECTION || 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: resolve('.', env.DB_DIRNAME, env.DB_DATABASE || './dev.sqlite3')
  },
  migrations: {
    directory: resolve('.', env.DB_DIRNAME, 'migrations'),
  },
  seeds: {
    directory: resolve('.', env.DB_DIRNAME || '', 'seeds')
  }
}
