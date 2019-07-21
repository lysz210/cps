export function toggleLanguagesDrawer({ commit, state: { languagesDrawer } }) {
  commit('setLanguagesDrawer', !languagesDrawer)
}

export function closeLanguagesDrawer({ commit }) {
  commit('setLanguagesDrawer', false)
}

export function openLanguagesDrawer({ commit }) {
  commit('setLanguagesDrawer', true)
}

export function toggleQuesturaDrawer({ commit, state: { questuraDrawer } }) {
  commit('setQuesturaDrawer', !questuraDrawer)
}

export function closeQuesturaDrawer({ commit }) {
  commit('setQuesturaDrawer', false)
}

export function openQuesturaDrawer({ commit }) {
  commit('setQuesturaDrawer', true)
}

export function toggleLinksDrawer({ commit, state: { linksDrawer } }) {
  commit('setLinksDrawer', !linksDrawer)
}

export function closeLinksDrawer({ commit }) {
  commit('setLinksDrawer', false)
}

export function openLinksDrawer({ commit }) {
  commit('setLinksDrawer', true)
}
