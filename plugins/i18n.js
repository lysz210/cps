import gql from 'graphql-tag'

export default function ({ app }) {
  app.i18n.beforeLanguageSwitch = async (_old, newLocale) => {
    // TODO: richiede maggiori attenzione all'inserimento
    // la query va migliorata anche lato server
    // FIXME: delete consoles
    // inglese non viene preso alla prima chiamata
    console.log('enter', new Date(), newLocale)
    const { data } = await app.apolloProvider.defaultClient.query({
      query: gql`
        query Translation($locale: String!, $group: String!) {
          translations(locale: $locale, group: $group) {
            messages
          }
        }
      `,
      variables: {
        locale: newLocale,
        group: 'cps'
      }
    })
    app.i18n.mergeLocaleMessage(newLocale, { cps: data.translations[0].messages })
    await new Promise(resolve => setTimeout(resolve, 1000)).then(() => console.log('DONE'))
    console.log(app.i18n.messages, app, data)
    console.log('exit', new Date())
  }
}
