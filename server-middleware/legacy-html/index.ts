import Nuxt from 'nuxt'
import Consola from 'consola'
import { promises } from 'fs'
import { join } from 'path'

import { readFileSync } from 'fs'
import _, {
  template,
  has,
  get,
  find
} from 'lodash'
import { Translation, Language } from '../../database/schema'
import { parse } from 'querystring'
import createTraslate from '../../my-lib/yandex';

export default async (req, res, next) => {
  try {
    const { headers, _parsedUrl} = req
    const q = parse(_parsedUrl.query)
    let t = createTraslate()
    let statoPratica
    let lang = get(q, 'lang', 'it')
    // const reqUrl = new URL(req._parsedUrl)
    if (has(q, 'pratica')) {
      statoPratica = await t.translateStatoPratica(<string> q.pratica, lang)
    }
    const base = await readFileSync(join(__dirname, 'layout.html'),{encoding: 'utf-8'})
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
