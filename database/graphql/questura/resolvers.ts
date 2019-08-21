import createTranslator from '../../../my-lib/yandex'

export const Query = {
  statoPratica: (_parent, { pratica, locale }) => {
    const t = createTranslator()
    return t.translateStatoPratica(pratica, locale)
  }
}
