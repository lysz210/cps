import { includes } from 'lodash'
import query from '~/database/graphql/i18n/client/query.gql'

async function fetchLocale (locale, apollo) {
  const { data } = await apollo.query({
    query: query.I18nMessages,
    variables: {
      locale: locale
    }
  })
  return data
}

async function loadLocale (locale, i18n, apollo) {
  if (includes(i18n.availableLocales, locale)) {
    return
  }
  let data = await fetchLocale(locale, apollo)
  i18n.mergeLocaleMessage(i18n.locale, data)
}

export default async function ({ app }) {
  const { i18n, apolloProvider } = app

  // caricamento della lingua
  // questa chiamata e' necesaria per garantire che
  // le traduzioni sia caricati anche al primo accesso
  // perche beforeLanguageSwitch viene chiamato
  // solo nelle chiamate successive
  await loadLocale(i18n.locale, i18n, apolloProvider.defaultClient)

  app.i18n.beforeLanguageSwitch = async function (_old, newLocale) {
    await loadLocale(newLocale, i18n, apolloProvider.defaultClient)
  }
}
