import { isEmpty, filter } from 'lodash'

export function hasResponses (state) {
  return !isEmpty(state.responses)
}

export function activeResponses (state) {
  return filter(state.responses, 'show')
}

export function showCard (_, { activeResponses }) {
  return activeResponses.length > 0
}

export function hideCard (state) {
  return !state.showCard
}
