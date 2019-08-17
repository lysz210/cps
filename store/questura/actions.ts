import Vue from 'vue'

// req must be a Apollo query request
export async function addResponse({ commit }, req) {
  /**
   * reset della risposta attuale e visualizza la card
   */
  commit('setErrors', null)
  commit('setShowCard', true)
  try {
    let res = await req
    let { data } = res
    data.show = true
    commit('addResponse', data)
    return data
  } catch (error) {
    console.error('error in Store[questura]', error)
    commit('setErrors', error)
    throw error
  }
}
