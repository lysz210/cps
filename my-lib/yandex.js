const axios = require('axios')
const querystring = require('querystring')

class Translate {

  get API_KEY_PATTERN () {
    return /^trnsl[a-zA-Z0-9.]+$/
  }

  constructor (apiUrl, apiKey, defaultSourceLang) {
    if (!this.API_KEY_PATTERN.test(apiKey)) {
      throw new Error(`The api key [${apiKey}] you provided is not valid!`)
    }
    this.$apiUrl = apiUrl
    this.$apiKey = apiKey
    this.$defaultSourceLang = defaultSourceLang || 'en'
    this.$axios = axios.create({
      baseURL: apiUrl
    })
  }

  _formatDirection (toLang, srcLang) {
    return `${srcLang || this.$defaultSourceLang}-${toLang}`
  }

  async translate(text, toLang, srcLang, format = 'html') {
    const formData = {
      key: this.$apiKey,
      lang: this._formatDirection(toLang, srcLang),
      text,
      format
    }
    console.log(formData)
    return this.$axios.post('translate', querystring.stringify(formData))
  }

  async availableLangs(lang) {
    return this.$axios.get('getLangs', {params: {
      key: this.$apiKey,
      ui: lang || this.$defaultSourceLang
    }})
  }
}

require('dotenv').config()
const { env } = process
const t = new Translate(env.YANDEX_TRANSLATE_API_URL, env.YANDEX_TRANSLATE_API_KEY, env.I18N_DEFAULT_LANG)

t.translate('<span>ciao questura<questura-id-placeholder/>${ciao}</span>', 'zh')
  .then(res => console.log(res.data))
  .catch(console.error)
