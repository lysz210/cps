import { find, pull } from 'lodash'
import { IStatoPratica } from '~/my-lib/questura';
import consola from 'consola'
export function setQuery (state, q) {
  state.query = q
}

export function addResponse (state, response) {
  if (!Array.isArray(state.responses)) {
    state.responses = [response]
    return
  }
  const { responses } = state
  // consola.info('response', response)
  pull(responses, find(responses, element => element.id === response.id)).unshift(response)
}

export function hideResponse (state, statoPratica: IStatoPratica) {
  const item = find(state.responses, element => element.id === statoPratica.id)
  consola.info('hiding', item)
  if (item) {
    item.show = false
  }
}

export function toggleResponse (state, statoPratica: IStatoPratica) {
  const item = find(state.responses, element => element.id === statoPratica.id)
  if (item) {
    item.show = !item.show
    consola.info('toggling', item.show)
  }
}

export function showResponse (state, statoPratica: IStatoPratica) {
  const item = find(state.responses, element => element.id === statoPratica.id)
  if (item) {
    item.show = true
  }
}

export function setErrors (state, errors) {
  state.errors = errors
}

export function setShowCard (state, show) {
  state.showCard = show
}
