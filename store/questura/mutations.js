export function setQuery(state, q) {
  state.query = q
}

export function addResponses(state, response) {
  if (!Array.isArray(state.responses)) {
    state.responses = []
  }
  state.responses.unshift(response)
}

export function setErrors(state, errors) {
  state.errors = errors
}

export function setShowCard(state, show) {
  state.showCard = show
}
