import {
  ApolloServer,
  gql
} from 'apollo-server-express'
import GraphQLJSON from 'graphql-type-json'

import { Language } from '../database/schema'

const typeDefs = gql`
  scalar JSON
  type Query {
    "A simple type of getting started!"
    locales: [Locale]
  }

  type Locale {
    id: Int
    locale: String!
    name: String!
    script: String
    navtive: String
    regional: String
  }

  type I18n {
    locale: String,
    message: JSON
  }
`
const resolvers = {
  Query: {
    locales: async () => await Language.query()
  },
  JSON: GraphQLJSON,
  // JSONObject: GraphQLJSONObject
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

export default function apolloServer (moduleOptions) {
  console.log('installing ApolloServer')
  this.nuxt.hook('render:setupMiddleware', app => {
    server.applyMiddleware({ app, path: '/gql' })
  })
}