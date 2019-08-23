import { Module } from '@nuxt/types'
import VueI18n from 'vue-i18n'
import Vue from 'vue'
import _ from 'lodash'

const legacyHtmlModule: Module<any> = function () {
  Vue.use(VueI18n)
  _.templateSettings.imports = { _i18n: new VueI18n(this.options.i18n.vueI18n) }
}
export default legacyHtmlModule
