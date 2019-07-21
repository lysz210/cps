import Vue from 'vue'
import Vuex, { createNamespacedHelpers } from 'vuex'

import layout from './layout'
import questura from './questura'
Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default () => {
  return new Vuex.Store({
    modules: {
      layout,
      questura
    },
    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })
}

export const layoutHelpers = createNamespacedHelpers('layout')

export const questuraHelpers = createNamespacedHelpers('questura')
