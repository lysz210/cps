export const Query = {
  statoPratica: (_parent, { pratica, locale }, { questuraApi }) => {
    return questuraApi.translate(pratica, locale)
  }
}
