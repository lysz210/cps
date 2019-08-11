// injext .env
// require = require("esm")(module/*, options*/)
const TSNode = require('ts-node')
TSNode.register({
  extends: "../../tsconfig.json",
  compilerOptions: {
    module: "commonjs",
  }
})

module.exports = require('./database/knexconfig').default

export {}
