import * as Knex from 'knex'
import {
  has
} from 'lodash'
import Consola from 'consola'
import createTranslate from '../../my-lib/yandex'
import { Language } from '../models/Language'
import knownLanguages from '../../i18n/known_locales.json'
import i18nConfigs from '../../i18n/configs'
import configs from '../../.env.json'

export async function seed (knex: Knex): Promise<any> {
  Consola.info(`Seeding: ${Language.tableName}`)
  const { primaryOrder } = i18nConfigs
  const maxPrimaryOrder = primaryOrder.length
  const mapOrder = primaryOrder.reduce((acc, key, index) => ({ ...acc, [key]: index - maxPrimaryOrder }), {})
  const t = createTranslate(configs)
  let langs
  try {
    const { data } = await t.availableLangs()
    langs = data.langs
  } catch (error) {
    Consola.error('Error on retrieve Yandex languages, default to cachedLocales', error)
    langs = require('../../my-lib/yandex').cacheLocales
  }
  Consola.info('Deleting data...')
  Consola.info(await Language.query(knex).delete())
  for (const lang of knownLanguages) {
    let langItem
    if (has(langs, lang.code)) {
      langItem = {
        ...lang,
        yandex: true,
        order: lang.code in mapOrder ? mapOrder[lang.code] : 0
      }
    } else {
      langItem = lang
    }

    await Language.query(knex).insert(langItem)
    Consola.info('Inserted', lang.code)
  }
  Consola.success(`${Language.tableName} seeded`)
  return true
}
