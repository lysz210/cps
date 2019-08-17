import { ApolloServer } from 'apollo-server-express'
import Nuxt from 'nuxt'

import i18n from '../database/graphql/i18n'

const server = new ApolloServer(i18n)

export default function apolloServer(this: Nuxt) {
  // console.log('installing ApolloServer')
  this.nuxt.hook('render:setupMiddleware', (app) => {
    server.applyMiddleware({ app, path: '/gql' })
  })
}
