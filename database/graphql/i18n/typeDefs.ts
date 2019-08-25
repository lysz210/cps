import { gql } from 'apollo-server-express'

export default gql`
scalar JSON
extend type Query {
  "A simple type of getting started!"
  locales: [Locale]
  translations(group: String!, locale: String!, namespace: String): JSON
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
