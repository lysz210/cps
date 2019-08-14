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

export const cacheLocales = {
  "af": "Afrikaans",
  "az": "Azerbaijani (Latin)",
  "id": "Indonesian",
  "ms": "Malay",
  "jv": "Javanese (Latin)",
  "su": "Sundanese",
  "bs": "Bosnian",
  "ca": "Catalan",
  "cy": "Welsh",
  "da": "Danish",
  "de": "German",
  "et": "Estonian",
  "en": "English",
  "es": "Spanish",
  "eo": "Esperanto",
  "eu": "Basque",
  "fr": "French",
  "ga": "Irish",
  "gl": "Galician",
  "gd": "Scottish Gaelic",
  "hr": "Croatian",
  "xh": "Xhosa",
  "it": "Italian",
  "sw": "Swahili",
  "ht": "Haitian",
  "la": "Latin",
  "lv": "Latvian",
  "lt": "Lithuanian",
  "lb": "Luxembourgish",
  "hu": "Hungarian",
  "mg": "Malagasy",
  "mt": "Maltese",
  "mi": "Māori",
  "nl": "Dutch",
  "pl": "Polish",
  "pt": "Portuguese",
  "ro": "Romanian",
  "sq": "Albanian",
  "sk": "Slovak",
  "sl": "Slovene",
  "fi": "Finnish",
  "sv": "Swedish",
  "tl": "Tagalog",
  "vi": "Vietnamese",
  "tr": "Turkish",
  "is": "Icelandic",
  "cs": "Czech",
  "el": "Greek",
  "uz": "Uzbek (Cyrillic)",
  "ky": "Kyrgyz",
  "sr": "Serbian (Cyrillic)",
  "ba": "Bashkir",
  "be": "Belarusian",
  "bg": "Bulgarian",
  "mk": "Macedonian",
  "mn": "Mongolian (Cyrillic)",
  "ru": "Russian",
  "tt": "Tatar",
  "tg": "Tajik (Cyrillic)",
  "uk": "Ukrainian",
  "kk": "Kazakh",
  "hy": "Armenian",
  "yi": "Yiddish",
  "he": "Hebrew",
  "ur": "Urdu",
  "ar": "Arabic",
  "fa": "Persian",
  "ne": "Nepali",
  "mr": "Marathi",
  "hi": "Hindi",
  "bn": "Bengali",
  "pa": "Punjabi (Gurmukhi)",
  "gu": "Gujarati",
  "ta": "Tamil",
  "te": "Telugu",
  "kn": "Kannada",
  "ml": "Malayalam",
  "si": "Sinhala",
  "th": "Thai",
  "lo": "Lao",
  "my": "Burmese",
  "ka": "Georgian",
  "am": "Amharic",
  "km": "Khmer",
  "ja": "Japanese",
  "zh": "Chinese (Simplified)",
  "ko": "Korean"
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
