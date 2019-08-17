import { gql } from 'apollo-server-express'
import typeDefs from './typeDefs'
import resolvers from './resolvers'

export const root = gql`
type Query {
  root: String
}

type Mutation {
  root: String
}
`

export default {
  typeDefs: [ root, ...typeDefs],
  resolvers
}
