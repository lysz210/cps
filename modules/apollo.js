import {
  ApolloServer,
  gql
} from 'apollo-server-express'
import GraphQLJSON from 'graphql-type-json'
const typeDefs = gql`
  scalar JSON
  type Query {
    "A simple type of getting started!"
    hello: JSON
    ciao: String
    i18n (locale: String)
  }

  type I18n {
    locale: String,
    message: JSON
  }
`

const resolvers = {
  Query: {
    hello: () => ({
      locale: 'en',
      messages: 'hello'
    }),
    ciao: () => "mondo"
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