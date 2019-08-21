import { uniqBy, has, get, concat, isString } from 'lodash'
import { Module } from '@nuxt/types'
import { Language } from '../database/schema'
import cps from '../i18n/it/cps'

/**
 * funzione asincrona per l'inserimento
 * del modulo nuxt-i18n. La funzione serve
 * per generare in modo dinamico attraverso il db
 * i locales disponibile.
 */
const i18nModule: Module<any> = async function myI18n (userOptions) {
  const dbLocales = await Language.query().where('yandex', true).select(['code']).orderBy('code')
  // data la natura del override order del modulo nuxt-i18n
  // bisogna modificare direttamente il options.i18n
  // per i parametri interessati
  const locales = concat(get(this.options, 'i18n.locales', []), get(userOptions, 'locales', []), dbLocales)
  if (!has(this.options, 'i18n')) {
    this.options.i18n = {}
  }
  this.options.i18n.vueI18n.messages.it.cps = cps
  // TODO: verificare che all'interno del message sia presente i message per il fallback
  // eventualmente recuperare i dati da db e anche cartella i18n ed effettuare merge dei valori
  // con preferenza su quelli in locale su i18n/<locale>
  // i valori in userOptions e options vengono considerati quelli di default per cui il merge sara'
  // messages[locale]: {...userOptions.messages[locale], ...this.options.i18n.vueI18n.messages[locale], ...DBLocales, ...FSLocales}
  this.options.i18n.locales = uniqBy(locales.map(locale => isString(locale) ? { code: locale } : locale), localeObject => localeObject.code)
  this.requireModule([
    'nuxt-i18n',
    userOptions
  ])
}
export default i18nModule
