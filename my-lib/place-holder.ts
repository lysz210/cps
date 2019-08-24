import { replace, get } from 'lodash'
export interface ITagPlaceholderCache {
  [key: string]: string
}

export class TagPlaceholder {
  static readonly basePlacehosder = 'pl4c3h0ld3r_'

  static readonly backRexExp = /\{pl4c3h0ld3r_\d+\}/g

  static readonly regExp = /<(\w+)>.*?<\/\w+>/g

  protected $cache: ITagPlaceholderCache = {}

  protected $tagList: string[]

  constructor (tagLista: string[]) {
    this.$tagList = tagLista
  }

  placehold (text: string) {
    this.$cache = {}
    return replace(text, TagPlaceholder.regExp, (matched, tagName, index) => {
      if (this.$tagList.includes(tagName)) {
        const placehoder = `{${TagPlaceholder.basePlacehosder}${index}}`
        this.$cache[placehoder] = matched
        return placehoder
      } else {
        return matched
      }
    })
  }

  unplacehold (text: string) {
    return replace(text, TagPlaceholder.backRexExp, matched => get(this.$cache, matched, matched))
  }
}
