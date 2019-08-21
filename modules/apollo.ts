import { ApolloServer } from 'apollo-server-express'
import { Module } from '@nuxt/types'
import consola from 'consola'

import schema from '../database/graphql'
import { QuesturaApi } from '../my-lib/questura';
import { get } from 'lodash'

const apolloModule: Module<any> = function apolloServer (_moduleOptions) {
  const server = new ApolloServer({
    ...schema,
    context: () => ({
      questuraApi: new QuesturaApi(get(this, 'options.env', {}))
    })
  })
  consola.log('installing ApolloServer', JSON.stringify(this.env, null, 4))
  this.nuxt.hook('render:setupMiddleware', (app) => {
    server.applyMiddleware({ app, path: '/gql' })
  })
}

export default apolloModule
