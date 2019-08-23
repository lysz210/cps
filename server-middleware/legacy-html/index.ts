import { readFileSync } from 'fs'
import { join } from 'path'
import { parse } from 'querystring'

import _, {
  template,
  has,
  get,
  find
} from 'lodash'
import { Language } from '../../database/schema'
import createTraslate from '../../my-lib/yandex'
import configs from '../../.env.json'

export default async (req, res, next) => {
  try {
    const { _parsedUrl } = req
    const q = parse(_parsedUrl.query)
    const t = createTraslate(configs)
    let statoPratica
    const lang = get(q, 'lang', 'it')
    // const reqUrl = new URL(req._parsedUrl)
    if (has(q, 'pratica')) {
      statoPratica = await t.translateStatoPratica(<string> q.pratica, lang)
    }
    const base = await readFileSync(join(__dirname, 'layout.html'), { encoding: 'utf-8' })
    const view = template(base, {
      imports: { _ }
    })
    const locales = await Language.query().select('code', 'native').where('yandex', true).orderBy('order').orderBy('code')
    res.end(await view({
      hello: 'ciao',
      statoPratica,
      locales,
      currentLocale: find(locales, { code: lang })
    }))
  } catch (error) {
    next(error)
  }
}
