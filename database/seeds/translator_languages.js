const { map } = require('lodash')
const knownLanguages = require('../../i18n/known_locales.json')
const TABLE_NAME = 'translator_languages'

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex(TABLE_NAME).del()
  const locales = map(knownLanguages, (localeObject) => ({
    ...localeObject,
    created_at: knex.fn.now(),
    updated_at: knex.fn.now()
  }))
  const res = await knex.batchInsert(TABLE_NAME, locales, 10)
  return res
}
