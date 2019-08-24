import { gql } from 'apollo-server-express'

export default gql`
extend type Query {
  statoPratica (pratica: String!, locale: String!): StatoPratica
}

type StatoPratica {
  title: String
  link: String
  decription: String
  language: String
  pratica: String
  item: DettaglioStatoPratica
}

type DettaglioStatoPratica {
  title: String
  link: String
  description: String
  guid: String
  pubDate: String
}
`
