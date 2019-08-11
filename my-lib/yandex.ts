import axios from 'axios';
// TODO: usare il URL.SearchParam
import querystring from 'querystring'
import { merge } from 'lodash'
import { config } from 'dotenv'
import createObjectPaths from './create-object-paths'
import { get } from 'lodash'

config()
// FIXME: da convertire in module es6
interface ITranslator {
  apiUrl?: string;
  apiKey?: string;
  defaultSourceLang?: string;
  axios: any;
}

export class Translate {

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

  private _formatDirection (toLang, srcLang) {
    return `${srcLang || Translate.defaultSourceLang}-${toLang}`
  }

  async *translateI18n(group: string, locales: string[]) {
    const dictionary = require(`../i18n/${Translate.defaultSourceLang}/${group}`).default
    const paths = createObjectPaths(dictionary)
    let lastCallTime = new Date()
    let currentCallTime
    for (let item of paths) {
      for (let locale of locales) {
        const { text } = await this.translate(get(dictionary, item), locale)
        currentCallTime = new Date()
        let diff = this.minCallInterval - (currentCallTime.getTime() - lastCallTime.getTime())
        // console.log('s', lastCallTime, 'e: ', currentCallTime, 'diff: ', diff)
        yield await new Promise(resolve => setTimeout(() => resolve({item, text, locale}), Math.max(diff, 0)))
        lastCallTime = currentCallTime
      }
    }
    
  }

  async translate(text, toLang, srcLang?: string, format = 'html') {
    const formData = {
      key: this.apiKey,
      lang: this._formatDirection(toLang, srcLang),
      text,
      format
    }
    const { data } = await this.axios.post('translate', querystring.stringify(formData))
    return data
  }

  async availableLangs(lang?: string) {
    return this.axios.get('getLangs', {params: {
      key: this.apiKey,
      ui: lang || Translate.defaultSourceLang
    }})
  }
}

export default function createTranslator (configs?: any) {
  let baseConfig = merge({}, {
    apiUrl: process.env.YANDEX_TRANSLATE_API_URL,
    apiKey: process.env.YANDEX_TRANSLATE_API_KEY
  }, configs)
  return new Translate(
    baseConfig.apiUrl,
    baseConfig.apiKey
  )
}
