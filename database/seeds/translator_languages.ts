import knownLanguages from '../../i18n/known_locales.json'
import { Language } from '../models/Language'

export async function seed (knex) {
  await Language.query(knex).insertGraph(knownLanguages)
}
