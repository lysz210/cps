
import GraphQLJSON from 'graphql-type-json'
import { Language, Translation } from '../../schema'
import { set } from 'lodash'

export const Query = {
  locales: () => Language.query().where('yandex', true).orderBy('order').orderBy('code'),
    translations: async (obj, {locale, group}) => {
      const dictionary = await Translation.query().where({group, locale})
      const messages = dictionary.reduce((acc, {item, text}) => set(acc, item, text), {})
      return [{locale, group, messages}]
    }
}

export const JSON = GraphQLJSON
