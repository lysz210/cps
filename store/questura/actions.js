import Vue from 'vue'

export async function check({ commit }, { q, locale }) {
  /**
   * reset della risposta attuale e visualizza la card
   */
  commit('setErrors', null)
  commit('setShowCard', true)
  try {
    const { data } = await Vue.api.post('', { q, locale })
    data.show = true
    commit('addResponses', data)
    return data
  } catch (error) {
    // console.error('error in Store[questura]', error)
    commit('setErrors', error)
    throw error
  }
}
