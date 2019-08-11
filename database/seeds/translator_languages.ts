import knownLanguages from '../../i18n/known_locales.json'
import { Language } from '../models/Language'
import * as Knex from 'knex'
import createTranslate from '../../my-lib/yandex'
import {
  has
} from 'lodash'
import Consola from 'consola'
import consolaGlobalInstance from 'consola';

export async function seed (knex: Knex): Promise<any> {
  Consola.info(`Seeding: ${Language.tableName}`)
  const t = createTranslate()
  const { data: {
    langs
  } } = await t.availableLangs()
  Consola.info('Deleting data...')
  Consola.info(await Language.query(knex).delete())
  for (let lang of knownLanguages) {
    let langItem;
    if (has(langs, lang.code)) {
      langItem = {
        ...lang,
        yandex: true
      }
    } else {
      langItem = lang
    }

    await Language.query(knex).insert(langItem)
    Consola.info('Inserted', lang.code)
  }
  consolaGlobalInstance.success(`${Language.tableName} seeded`)
  return true
}
