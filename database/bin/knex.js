const TSNode = require('ts-node')
TSNode.register({
  extends: "../../tsconfig.json",
  compilerOptions: {
    module: "commonjs",
  }
})

const consola = require('consola')
const Cmd = require('commander')
const cfg = require('../knexconfig').default
const { knex } = require('../schema')

Cmd
  .version('0.0.1')

Cmd
  .command('seed:run')
  .description('seed')
  .option('--specific <file>', 'run specific seed file')
  .action(async () => {
    consola.info(Cmd.opts())
    consola.info('init')
    try {
      await knex.seed.run()
      consola.info('DONE')
      process.exit(0)
    } catch (error) {
      consola.error(error)
      process.exit(1)
    }
  })

Cmd.parse(process.argv)
