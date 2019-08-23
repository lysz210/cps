import { find, pull } from 'lodash'
// import consola from 'consola'
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
  pull(responses, find(responses, element => element.item.guid === response.item.guid)).unshift(response)
}

export function hideResponse (state, guid: string) {
  const item = find(state.responses, element => element.item.guid === guid)
  if (item) {
    item.show = false
  }
}

export function showResponse (state, guid: string) {
  const item = find(state.responses, element => element.item.guid === guid)
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
