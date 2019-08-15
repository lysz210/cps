import { get, has, set, trim } from 'lodash'
import axios from 'axios'
import parser from 'fast-xml-parser'
import { decode } from 'he'

export interface QuesturaQueryInterface {
  pratica: string;
  lang?: string;
  mime?: string;
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

const testData = `'<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
	<channel>
	<title>Permesso di soggiorno</title> 
	<link>https://questure.poliziadistato.it/stranieri/</link> 
	<description>Polizia di Stato</description> 
	<language>it</language> 
	<!--image>
		<url>https://www.poliziadistato.it/pds/images/araldo75px.png</url>
		<title>Il sito ufficiale della Polizia di Stato</title>
		<link>https://www.poliziadistato.it</link>
		<width>50</width>
		<height>80</height>
	</image-->
	<item>
		<title>Numero pratica o assicurata : 061534627074 </title> 
		<link>https://questure.poliziadistato.it/servizio/servizio/stranieri/?lang=italian&amp;pratica=061534627074</link>
		<description>
		<![CDATA[
                 Il documento di soggiorno non &egrave; presente in archivio. 
		]]>
		</description>
        <guid>https://questure.poliziadistato.it/servizio/stranieri/?lang=italian&pratica=061534627074</guid>
        <pubDate>Thu, 15 Aug 19 10:48:25 +0200</pubDate>
	</item>
	
	</channel>
</rss>'`

export class QuesturaApi {
  axios: any;

  constructor (readonly baseURL: string) {
    this.axios = axios.create({
      baseURL: this.baseURL,
      responseType: 'document',
      transformResponse (data) {
        let rss = parser.parse(data)
        let basePath = 'rss.channel.item'
        let descrizionePath = `${basePath}.description`
        if (has(rss, descrizionePath)) {
          set(rss, descrizionePath, trim(decode(get(rss, descrizionePath))))
        }
        return rss
      }
    })
  }

  async getFeed(pratica: string) {
    const params = new QuesturaQuery({ pratica })
    return this.axios.get('stranieri', { params })
  }
}

let q = new QuesturaApi('http://questure.poliziadistato.it')
q.getFeed('061534627074').then(res => res.data.rss.channel.item).then(console.log, console.error)
