import { ApolloServer } from 'apollo-server-express'
import Nuxt from 'nuxt'

import schema from '../database/graphql'

const server = new ApolloServer(schema)

export default function apolloServer (this: Nuxt) {
  // console.log('installing ApolloServer')
  this.nuxt.hook('render:setupMiddleware', (app) => {
    server.applyMiddleware({ app, path: '/gql' })
  })
}
