export default function midI18n ({ app, route }) {
  const { i18n, apolloProvider } = app
  console.log('Middleware i18n', i18n.locale, route)
}
