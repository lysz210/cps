<template>
  <v-card>
    <v-app-bar flat>
      <v-text-field
        v-model="numeroPratica"
        :placeholder="$t('cps.searchHint')"
        single-line
        hide-details
        :prepend-icon="mdiBarcode"
        clearable
      ></v-text-field>
      <v-btn icon @click="verifica(numeroPratica)">
        <v-icon>search</v-icon>
      </v-btn>
    </v-app-bar>
    <v-card flat>
      <v-container fluid grid-list-lg>
        <v-layout row wrap>
          <v-flex v-for="(response, i) in activeResponses" :key="i" xs12>
            <questura-response :response="response" />
            <pre>{{ response }}</pre>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
    {{ numeroPratica }}
  </v-card>
</template>

<script lang="ts">
import { mdiBarcode } from '@mdi/js'
import { debounce } from 'lodash'
import { createNamespacedHelpers } from 'vuex'
import query from '~/database/graphql/questura/client/query.gql'

const {
  // mapState: questuraState,
  mapGetters: questuraGetters,
  // mapMutations: questuraMutations,
  mapActions: questuraActions
} = createNamespacedHelpers('questura')

export default {
  components: {
    QuesturaResponse: () => import('./StatoPratica')
  },
  data() {
    return {
      mdiBarcode,
      numeroPratica: null
    }
  },
  computed: {
    ...questuraGetters([
      'hideCard',
      'hasResponses',
      'activeResponses',
      'showCard'
    ])
  },
  methods: {
    ...questuraActions(['addResponse']),
    verifica: debounce(async function (this: any, q: string) {
      await this.addResponse(
        this.$apollo.query({
          query: query.StatoPratica,
          variables: {
            pratica: q,
            locale: this.$i18n.locale
          }
        })
      )
    })
  }
}
</script>