<template>
  <v-card>
    <v-app-bar flat>
      <v-text-field
        v-model="numeroPratica"
        name="pratica"
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
            <stato-pratica
              :pratica="response"
              @close="response.show = false"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
    {{ numeroPratica }}
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { mdiBarcode } from '@mdi/js'
import { debounce } from 'lodash'
import { createNamespacedHelpers } from 'vuex'
import query from '~/database/graphql/questura/client/query.gql'
// import StatoPratica from '~/components/questura/StatoPratica'

const {
  // mapState: questuraState,
  mapGetters: questuraGetters,
  // mapMutations: questuraMutations,
  mapActions: questuraActions
} = createNamespacedHelpers('questura')

@Component({
  components: {
    StatoPratica: () => import('./StatoPratica.vue')
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
    ...questuraActions(['addResponse'])
  }
})
export default class QuesturaSearch extends Vue {
  mdiBarcode = mdiBarcode

  numeroPratica: String | null = null

  verifica = debounce(async function (this: any, q: string) {
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
</script>
