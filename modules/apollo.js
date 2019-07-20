import {
  ApolloServer,
  gql
} from 'apollo-server-express'
import GraphQLJSON from 'graphql-type-json'
const { map } = require('lodash')
const knownLanguages = require('../i18n/known_locales.json')
const typeDefs = gql`
  scalar JSON
  type Query {
    "A simple type of getting started!"
    locales: [Locale],
    ciao: JSON
  }

  type Locale {
    id: Int
    locale: String
    name: String
    script: String
    navtive: String
    regional: String
  }

  type I18n {
    locale: String,
    message: JSON
  }
`
let id = 1
const resolvers = {
  Query: {
    locales: () => map(knownLanguages, (localeObject, locale) => ({id: id++, locale, ...localeObject}))
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