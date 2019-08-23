import { find, merge } from 'lodash'
// import consola from 'consola'
export function setQuery (state, q) {
  state.query = q
}

export function addResponse (state, response) {
  if (!Array.isArray(state.responses)) {
    state.responses = []
  }
  // consola.info('response', response)
  let item = find(state.responses, function (element) {
    return element.item.guid == response.item.guid
  })
  if (item) {
    merge(item, response)
  } else {
    state.responses.unshift(response)
  }
}

export function hideResponse (state, guid: string) {
  let item = find(state.responses, element => element.item.guid == guid)
  if (item) {
    item.show = false
  }
}

export function showResponse (state,  guid: string) {
  let item = find(state.responses, element => element.item.guid == guid)
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
