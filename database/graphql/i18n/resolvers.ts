
import GraphQLJSON from 'graphql-type-json'
import { set } from 'lodash'
import { Language, Translation } from '../../schema'

export const Query = {
  locales: () => Language.query().where('yandex', true).orderBy('order').orderBy('code'),
  translations: async (_obj, { locale, group }) => {
    const dictionary = await Translation.query().where({ group, locale })
    const messages = dictionary.reduce((acc, { item, text }) => set(acc, item, text), {})
    return messages
  }
}

export const JSON = GraphQLJSON
