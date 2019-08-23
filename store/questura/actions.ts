import { IResponseStatoPratica } from "~/types/lys";

// req must be a Apollo query request
export async function addResponse ({ commit }, req: IResponseStatoPratica) {
  /**
   * reset della risposta attuale e visualizza la card
   */
  commit('setErrors', null)
  commit('setShowCard', true)
  try {
    const res = await req
    const { data: { statoPratica } }= res
    statoPratica.show = true
    commit('addResponse', statoPratica)
    return statoPratica
  } catch (error) {
    console.error('error in Store[questura]', error)
    commit('setErrors', error)
    throw error
  }
}
