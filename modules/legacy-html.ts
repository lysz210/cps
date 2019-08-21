import Nuxt from 'nuxt'
import VueI18n from 'vue-i18n'
import Vue from 'vue'
import _ from 'lodash'
export default function (this: Nuxt) {
  Vue.use(VueI18n)
  _.templateSettings.imports = { _i18n: new VueI18n(this.options.i18n.vueI18n) }
}
