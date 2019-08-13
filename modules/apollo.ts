import { ApolloServer, gql } from 'apollo-server-express'
import GraphQLJSON from 'graphql-type-json'

import { Language } from '../database/schema'
import localesIt from '../i18n/it/cps'
import Nuxt from 'nuxt'

const typeDefs = gql`
  scalar JSON
  type Query {
    "A simple type of getting started!"
    locales: [Locale]
    translations(locale: String!, group: String!): [Translation]
  }

  type Locale {
    id: Int
    code: String!
    name: String!
    script: String
    native: String
    regional: String
  }

  type Translation {
    id: Int
    locale: String!
    namespace: String
    group: String!
    messages: JSON
  }
`
const resolvers = {
  Query: {
    locales: () => Language.query().where('yandex', true),
    translations: (obj, {locale, group}) => {
      return [{locale, group, messages: localesIt}]
    }
  },
  JSON: GraphQLJSON
  // JSONObject: GraphQLJSONObject
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

export default function apolloServer(this: Nuxt, moduleOptions) {
  // console.log('installing ApolloServer')
  this.nuxt.hook('render:setupMiddleware', (app) => {
    server.applyMiddleware({ app, path: '/gql' })
  })
}
