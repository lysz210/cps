const colors = require('vuetify/es5/util/colors').default
require('dotenv').config()
let i = 0
module.exports = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/vuetify',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/eslint-module',
    '~/modules/apollo',
    '@nuxtjs/apollo',
    'nuxt-i18n'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    theme: {
      primary: colors.blue.darken2,
      accent: colors.grey.darken3,
      secondary: colors.amber.darken3,
      info: colors.teal.lighten1,
      warning: colors.amber.base,
      error: colors.deepOrange.accent4,
      success: colors.green.accent3
    }
  },

  /*
   *
   */
  i18n: {
    // FIXME: i module options non sono dinamici se non previsti dal modulo stesso
    // vengono richiamati una sola volta durante il build.
    // si puo' renderlo un modulo personalizzato che effettua il inject di nuxt-i18n
    // per poter utilizzare la sintassi es6 import per recuperare i dati da db
    // attraverso il model Language che viene utilizzato attualmente da apollo
    // dopo aver effettuato questa operazione non bisogna piu' fare affidamente su
    // apollo quer recuperare i locales diponibile perche' non piu' affidabili
    // ma utilizzare direttamente quelli disponibili su $i18n.
    // il modulo durante il build puo' effettuare la richiesta a yandex per recuperare le lingue
    // disponibili per la traduzione. Solo per PROD effettuare la traduzione di tutte le entry delle traduzioni
    // da verificare se e' possibile ricostruire anche l'intera lista dei routes al nuxt.start
    // oppure e' un'operazione esclusivamente del build
    locales: Object.keys(require('./i18n/known_locales.json')),
    defaultLocale: 'en',
    vueI18n: {
      fallbackLocale: 'en',
      messages: {
        en: {
          hello: 'hello'
        },
        it: {
          hello: 'ciao'
        }
      }
    }
  },

  /**
   * apollo configs
   */
  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: `${process.env.APP_URL}:3000/gql`
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}
