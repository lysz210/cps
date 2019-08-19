import NuxtConfiguration from '@nuxt/config'
import colors from 'vuetify/es5/util/colors'
import env from './.env.json'

const config: NuxtConfiguration = {
  mode: 'universal',
  env,
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
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [
    '@/assets/style/app.scss'
  ],
  /*
   ** Server side middleware
   */
  serverMiddleware: [
    {
      path: '/legacy',
      handler: '~/server-middleware/legacy-html'
    }
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/i18n.js'}
  ],
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
    '~/modules/my-i18n',
    '~/modules/legacy-html'
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
    },
  },
  /**
   * apollo configs
   */
  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: `${env.APP_URL}:3000/gql`
      }
    }
  },
  /*
   *
   */
  i18n: {
    locales: ['en', 'it'],
    defaultLocale: 'it',
    // Routes generation strategy, can be set to one of the following:
    // - 'prefix_except_default': add locale prefix for every locale except default
    // - 'prefix': add locale prefix for every locale
    // - 'prefix_and_default': add locale prefix for every locale and default
    strategy: 'prefix_and_default',
    vueI18n: {
      fallbackLocale: 'it',
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

export default config