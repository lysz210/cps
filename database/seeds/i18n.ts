import * as Knex from 'knex'
import Consola from 'consola'
import { Translation } from '../models/Translation'
import { Language } from '../models/Language'
import createTranslate from '../../my-lib/yandex'
import configs from '../../.env.json'

export async function seed (knex: Knex): Promise<any> {
  Consola.info(`Seeding: ${Translation.tableName}`)
  const t = createTranslate(configs)

  const langs = await Language.query(knex).where('yandex', true).orderBy('order').limit(6)
  // return true
  console.log(await Translation.query(knex).delete())
  const start = new Date()
  let count = 0
  Consola.info('Start', start)
  try {
    for await (const translation of t.translateI18n('cps', <string[]>langs.map(lang => lang.code))) {
      Consola.info(count++, new Date(), translation)
      await Translation.query(knex).insert(translation)
    }
  } catch (err) {
    Consola.error(err)
  }
  // console.log(createObjectPaths(cookies), createObjectPaths(cps))

  Consola.success(`${Translation.tableName} SEEDED`)
  return true
};
