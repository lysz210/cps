import createTranslator from '../../../my-lib/yandex'

export const Query = {
  statoPratica: async (parent, { pratica, locale }) => {
    const t = createTranslator()
    return await t.translateStatoPratica(pratica, locale)
  }
}
