import { gql } from 'apollo-server-express'

export default gql`
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
