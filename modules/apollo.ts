import { ApolloServer } from 'apollo-server-express'
import { Module } from '@nuxt/types'
import consola from 'consola'

import { get, set } from 'lodash'
import schema from '../database/graphql'
import { QuesturaApi } from '../my-lib/questura'

const apolloModule: Module<any> = function apolloServer (_moduleOptions) {
  const server = new ApolloServer({
    ...schema,
    context: () => ({
      questuraApi: new QuesturaApi(get(this, 'options.env', {}))
    })
  })
  const { server: serverConfig = {} } = this.options
  set(this.options, 'apollo.clientConfigs.default.httpEndpoint', `http${serverConfig.https ? 's' : ''}://${serverConfig.host}:${serverConfig.port}/gql`)
  this.addModule('@nuxtjs/apollo')
  consola.info('installing ApolloServer')
  consola.info('app', this.options.apollo)
  this.nuxt.hook('render:setupMiddleware', (app) => {
    server.applyMiddleware({ app, path: '/gql' })
  })
}

export default apolloModule
