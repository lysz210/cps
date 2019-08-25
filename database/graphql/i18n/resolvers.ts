
import GraphQLJSON from 'graphql-type-json'
import { set } from 'lodash'
import { Language, Translation } from '../../schema'
import consola from 'consola'

export const Query = {
  locales: () => Language.query().where('yandex', true).orderBy('order').orderBy('code'),
  translations: async (_obj, { locale, group, namespace = '*' }) => {
    const dictionary = await Translation.query().where({ group, locale, namespace })
    const messages = dictionary.reduce((acc, { item, text }) => set(acc, item, text), {})
    consola.log('messages', locale, group, namespace, messages)
    return messages
  }
}

export const JSON = GraphQLJSON
