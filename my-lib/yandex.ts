const axios = require('axios')
// TODO: usare il URL.SearchParam
const querystring = require('querystring')

// FIXME: da convertire in module es6
interface ITranslator {
  apiUrl?: string;
  apiKey?: string;
  defaultSourceLang?: string;
  axios: any;
}

export class Translate {

  readonly axios: any;

  get API_KEY_PATTERN () {
    return /^trnsl[a-zA-Z0-9.]+/
  }

  constructor (public readonly apiUrl, public readonly apiKey, public defaultSourceLang = 'it') {
    if (!this.API_KEY_PATTERN.test(apiKey)) {
      throw new Error(`The api key [${apiKey}] you provided is not valid!`)
    }
    this.axios = axios.create({
      baseURL: apiUrl
    })
  }

  _formatDirection (toLang, srcLang) {
    return `${srcLang || this.defaultSourceLang}-${toLang}`
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
      ui: lang || this.defaultSourceLang
    }})
  }
}
