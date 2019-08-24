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
          <v-flex v-for="statoPratica in responses" :key="statoPratica.id" xs12>
            <questura-stato-pratica
              :pratica="statoPratica"
              @toggle="toggleResponse(statoPratica)"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { mdiBarcode } from '@mdi/js'
import { debounce } from 'lodash'
import { namespace } from 'vuex-class'
import query from '~/database/graphql/questura/client/query.gql'
import { IStatoPraticaDisplayable } from '~/types/lys'

const {
  State,
  Getter,
  Action,
  Mutation
} = namespace('questura')

@Component({
  components: {
    QuesturaStatoPratica: () => import('./QuesturaStatoPratica.vue')
  }
})
export default class QuesturaSearch extends Vue {
  mdiBarcode = mdiBarcode

  numeroPratica: String | null = null

  @Getter
  hideCard!: boolean

  @Getter
  hasResponses!: boolean

  @State
  responses!: IStatoPraticaDisplayable[]

  @Getter
  showCard!: boolean

  @Action
  addResponse!: (req: any) => Promise<IStatoPraticaDisplayable>

  @Mutation
  toggleResponse!: (guid: IStatoPraticaDisplayable) => void

  verifica = debounce(async function (this: QuesturaSearch, q: string) {
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
