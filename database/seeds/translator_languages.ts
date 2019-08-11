import knownLanguages from '../../i18n/known_locales.json'
import { Language } from '../models/Language'
import * as Knex from 'knex'
import { Translate } from '../../my-lib/yandex'
import {
  has
} from 'lodash'

export async function seed (knex: Knex): Promise<any> {
  const t = new Translate(process.env.YANDEX_TRANSLATE_API_URL || '', process.env.YANDEX_TRANSLATE_API_KEY || '', process.env.I18N_DEFAULT_LANG || 'it')
  const { data: {
    langs
  } } = await t.availableLangs()
  console.log(await Language.query(knex).delete())
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
  }
  return true

}
