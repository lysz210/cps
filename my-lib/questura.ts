import { get, has, set, trim, replace } from 'lodash'
import axios from 'axios'
import parser from 'fast-xml-parser'
import { decode } from 'he'

import createTranslator, { Translate } from './yandex'

export interface QuesturaQueryInterface {
  pratica: string
  lang?: string
  mime?: string
}

export class QuesturaQuery implements QuesturaQueryInterface {
  static DEFAULT_LANG = 'italian'

  static DEFAULT_MIME = 4

  pratica: string

  lang: string

  mime: string

  invia: string = 'invia'

  constructor (q: QuesturaQueryInterface) {
    this.pratica = get(q, 'pratica')
    this.lang = get(q, 'lang', QuesturaQuery.DEFAULT_LANG)
    this.mime = get(q, 'mime', QuesturaQuery.DEFAULT_MIME)
  }
}

// const testData = `<?xml version="1.0" encoding="UTF-8" ?>
// <rss version="2.0">
//   <channel>
//   <title>Permesso di soggiorno</title>
//   <link>https://questure.poliziadistato.it/stranieri/</link>
//   <description>Polizia di Stato</description>
//   <language>it</language>
//   <!--image>
//     <url>https://www.poliziadistato.it/pds/images/araldo75px.png</url>
//     <title>Il sito ufficiale della Polizia di Stato</title>
//     <link>https://www.poliziadistato.it</link>
//     <width>50</width>
//     <height>80</height>
//   </image-->
//   <item>
//     <title>Numero pratica o assicurata : 061534627074 </title>
//     <link>https://questure.poliziadistato.it/servizio/servizio/stranieri/?lang=italian&amp;pratica=061534627074</link>
//     <description>
//     <![CDATA[
//                  Il documento di soggiorno non &egrave; presente in archivio.
//     ]]>
//     </description>
//         <guid>https://questure.poliziadistato.it/servizio/stranieri/?lang=italian&pratica=061534627074</guid>
//         <pubDate>Thu, 15 Aug 19 10:48:25 +0200</pubDate>
//   </item>

//   </channel>
// </rss>`

export interface IRss {
  rss: {
    channel: IStatoPratica
  }
}

export interface IBasePratica {
  title: string
  link: string
  description: string
}

export interface IStatoPratica extends IBasePratica {
  language: string
  item: IDettaglioPratica
}

export interface IDettaglioPratica extends IBasePratica {
  guid: string
  pubDate: string
}

export class QuesturaApi {
  readonly cdataTagRe = /<!\[CDATA\[|\]\]>/ig

  readonly praticaPlaceholder = '{pl4c3h0ld3r}'

  axios: any;

  translator: Translate

  constructor (configs) {
    this.axios = axios.create({
      baseURL: configs.QUESTURA_API_URL || ''
    })
    this.translator = createTranslator(configs)
  }

  private _transformResponse (data): IRss {
    const rss = parser.parse(data)
    const basePath = 'rss.channel.item'
    const descrizionePath = `${basePath}.description`
    if (has(rss, descrizionePath)) {
      set(rss, descrizionePath, trim(decode(get(rss, descrizionePath))))
    }
    return rss
  }

  async getFeed (pratica: string): Promise<string> {
    const params = new QuesturaQuery({ pratica })
    const { data } = await this.axios.get('stranieri', { params })
    return data
  }

  async translate (pratica: string, locale: string): Promise<IStatoPratica> {
    // yandex translate lascia i testi in cdata completamente invariati
    // per garantire che vengano tradotti bisogna toglierli da cdata
    let feed = replace(await this.getFeed(pratica), this.cdataTagRe, '')
    // sostituisce la pratica con un placeholder per garantire che non sia
    // presente durante la traduzione
    feed = replace(feed, pratica, this.praticaPlaceholder)

    let translated
    try {
      translated = await this.translator.translateStatoPratica(feed, locale)
    } catch (err) {
      console.error('translation error', err, 'ORIGINAL RESPONSE WILL BE USED')
      translated = feed
    }
    // reinserimento del numero pratica
    translated = replace(translated, this.praticaPlaceholder, pratica)
    // console.log(translated)
    const translatedfeedObject = this._transformResponse(translated)
    console.log(translatedfeedObject)
    return get(translatedfeedObject, 'rss.channel')
  }
}
