import { ApolloServer } from 'apollo-server-express'
import { Module } from '@nuxt/types'

import schema from '../database/graphql'

const server = new ApolloServer(schema)

const apolloModule: Module<any> = function apolloServer (_moduleOptions) {
  // console.log('installing ApolloServer')
  this.nuxt.hook('render:setupMiddleware', (app) => {
    server.applyMiddleware({ app, path: '/gql' })
  })
}

export default apolloModule
