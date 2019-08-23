// TODO: usare il URL.SearchParam
import querystring from 'querystring'
import axios from 'axios'
import { get, first, replace, join } from 'lodash'
import { config } from 'dotenv'

import md5 from 'md5'
import consola from 'consola'
import { Translation } from '../database/schema'
import { TranslationInterface } from '../database/models/Translation'
import createObjectPaths from './create-object-paths'

config()

interface ITranslator {
  apiUrl?: string;
  apiKey?: string;
  defaultSourceLang?: string;
  axios: any;
}

export const cacheLocales = {
  af: 'Afrikaans',
  az: 'Azerbaijani (Latin)',
  id: 'Indonesian',
  ms: 'Malay',
  jv: 'Javanese (Latin)',
  su: 'Sundanese',
  bs: 'Bosnian',
  ca: 'Catalan',
  cy: 'Welsh',
  da: 'Danish',
  de: 'German',
  et: 'Estonian',
  en: 'English',
  es: 'Spanish',
  eo: 'Esperanto',
  eu: 'Basque',
  fr: 'French',
  ga: 'Irish',
  gl: 'Galician',
  gd: 'Scottish Gaelic',
  hr: 'Croatian',
  xh: 'Xhosa',
  it: 'Italian',
  sw: 'Swahili',
  ht: 'Haitian',
  la: 'Latin',
  lv: 'Latvian',
  lt: 'Lithuanian',
  lb: 'Luxembourgish',
  hu: 'Hungarian',
  mg: 'Malagasy',
  mt: 'Maltese',
  mi: 'Māori',
  nl: 'Dutch',
  pl: 'Polish',
  pt: 'Portuguese',
  ro: 'Romanian',
  sq: 'Albanian',
  sk: 'Slovak',
  sl: 'Slovene',
  fi: 'Finnish',
  sv: 'Swedish',
  tl: 'Tagalog',
  vi: 'Vietnamese',
  tr: 'Turkish',
  is: 'Icelandic',
  cs: 'Czech',
  el: 'Greek',
  uz: 'Uzbek (Cyrillic)',
  ky: 'Kyrgyz',
  sr: 'Serbian (Cyrillic)',
  ba: 'Bashkir',
  be: 'Belarusian',
  bg: 'Bulgarian',
  mk: 'Macedonian',
  mn: 'Mongolian (Cyrillic)',
  ru: 'Russian',
  tt: 'Tatar',
  tg: 'Tajik (Cyrillic)',
  uk: 'Ukrainian',
  kk: 'Kazakh',
  hy: 'Armenian',
  yi: 'Yiddish',
  he: 'Hebrew',
  ur: 'Urdu',
  ar: 'Arabic',
  fa: 'Persian',
  ne: 'Nepali',
  mr: 'Marathi',
  hi: 'Hindi',
  bn: 'Bengali',
  pa: 'Punjabi (Gurmukhi)',
  gu: 'Gujarati',
  ta: 'Tamil',
  te: 'Telugu',
  kn: 'Kannada',
  ml: 'Malayalam',
  si: 'Sinhala',
  th: 'Thai',
  lo: 'Lao',
  my: 'Burmese',
  ka: 'Georgian',
  am: 'Amharic',
  km: 'Khmer',
  ja: 'Japanese',
  zh: 'Chinese (Simplified)',
  ko: 'Korean'
}

export class Translate implements ITranslator {
  readonly maxCallPerMinute = 30

  readonly minCallInterval = 60 * 1000 / this.maxCallPerMinute

  static defaultSourceLang: string = process.env.I18N_DEFAULT_LANG || 'it'

  readonly axios: any;

  get API_KEY_PATTERN () {
    return /^trnsl[a-zA-Z0-9.]+/
  }

  constructor (public readonly apiUrl, public readonly apiKey) {
    if (!this.API_KEY_PATTERN.test(apiKey)) {
      throw new Error(`The api key [${apiKey}] you provided is not valid!`)
    }
    this.axios = axios.create({
      baseURL: apiUrl
    })
  }

  private _formatDirection (toLang: string, srcLang?: string) {
    return `${srcLang || Translate.defaultSourceLang}-${toLang}`
  }

  async *translateI18n (group: string, locales: string[]): AsyncIterableIterator<TranslationInterface> {
    const dictionary = require(`../i18n/${Translate.defaultSourceLang}/${group}`).default
    const paths = createObjectPaths(dictionary)
    let lastCallTime = new Date()
    let currentCallTime
    for (const item of paths) {
      for (const locale of locales) {
        const { text } = await this.translate(get(dictionary, item), locale)
        currentCallTime = new Date()
        const diff = this.minCallInterval - (currentCallTime.getTime() - lastCallTime.getTime())
        yield await new Promise(resolve => setTimeout(() => resolve({ group, item, text: first(text), locale }), Math.max(diff, 0)))
        lastCallTime = currentCallTime
      }
    }
  }

  async translate (text, toLang, srcLang?: string, format = 'html') {
    const formData = {
      key: this.apiKey,
      lang: this._formatDirection(toLang, srcLang),
      text,
      format
    }
    const { data } = await this.axios.post('translate', querystring.stringify(formData))
    return data
  }

  availableLangs (lang?: string) {
    return this.axios.get('getLangs', { params: {
      key: this.apiKey,
      ui: lang || Translate.defaultSourceLang
    } })
  }

  /**
   * questo metodo non conosce effettivamente la forma dei dati ricevuto
   * importante e' che il dato in input sia una string xml valida
   * @param xml
   */
  async translateStatoPratica (xml: string, locale: string): Promise<string> {
    // il hash utilizza esclusivamente i caratteri significativi
    // ignorando caratteri bianchi usati per la formattazione
    // sostituendo tutti i caratteri di spaziatura singoli
    // o consecutivi in un'unico spazio ' '
    const hash = md5(replace(xml, /\s+/g, ' '))
    let response: string
    const group = 'questura'
    const cached = await Translation.query().where({
      group,
      item: hash,
      locale
    }).first()
    if (cached) {
      console.log('from cache')
      response = cached.text || xml
    } else {
      const { text } = await this.translate(xml, locale)

      response = join(text)
      // cache the translation on db for future use
      try {
        await Translation.query().insert({
          locale,
          group,
          item: hash,
          text: response
        })
      } catch (error) {
        consola.error('Error saving translated text', error)
      }
    }

    return response
  }
}

export default function createTranslator (configs) {
  return new Translate(
    configs.YANDEX_TRANSLATE_API_URL || '',
    configs.YANDEX_TRANSLATE_API_KEY || ''
  )
}
