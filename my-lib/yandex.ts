import axios from 'axios';
// TODO: usare il URL.SearchParam
import querystring from 'querystring'
import { merge } from 'lodash'
import { config } from 'dotenv'

config()
// FIXME: da convertire in module es6
interface ITranslator {
  apiUrl?: string;
  apiKey?: string;
  defaultSourceLang?: string;
  axios: any;
}

export class Translate {

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

  _formatDirection (toLang, srcLang) {
    return `${srcLang || Translate.defaultSourceLang}-${toLang}`
  }

  async translate(text, toLang, srcLang, format = 'html') {
    const formData = {
      key: this.apiKey,
      lang: this._formatDirection(toLang, srcLang),
      text,
      format
    }
    console.log(formData)
    return this.axios.post('translate', querystring.stringify(formData))
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
  console.log(configs, baseConfig)
  return new Translate(
    baseConfig.apiUrl,
    baseConfig.apiKey
  )
}
