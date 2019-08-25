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
        :error="$v.$dirty && $v.$invalid"
        hint="ciao"
        @keypress="onChange()"
      ></v-text-field>
      <v-btn icon @click="verifica(numeroPratica)">
        <v-icon>search</v-icon>
      </v-btn>
      <template
        v-if="$v.$invalid"
        #extension
      >
        <p>Inserire il numero di pratica</p>
      </template>
    </v-app-bar>
    <pre>
      {{ $v }}
    </pre>
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
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { mdiBarcode } from '@mdi/js'
import { debounce, trim } from 'lodash'
import { namespace } from 'vuex-class'
import query from '~/database/graphql/questura/client/query.gql'
import { IStatoPraticaDisplayable } from '~/types/lys'

type RuleChecker = (value: any) => Boolean | string

const {
  State,
  Getter,
  Action,
  Mutation
} = namespace('questura')

@Component({
  components: {
    QuesturaStatoPratica: () => import('./QuesturaStatoPratica.vue')
  },
  mixins: [validationMixin],
  validations: {
    numeroPratica: {
      required,
      twelveDigits (value) {
        return /^\d{12}$/.test(value)
      }
    }
  }
})

export default class QuesturaSearch extends Vue {
  mdiBarcode = mdiBarcode

  get hasError () {
    return trim(this.numeroPratica).length === 12
  }

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
    this.$v.$touch()
    if (this.$v.$invalid) {
      return
    }
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

  onChange = debounce(function (this: QuesturaSearch) {
    const { $invalid, $dirty } = this.$v
    console.log()
    if (!$invalid && $dirty) {
      this.$v.$reset()
    }
    // if (!this.$v.$invalid) {
    // }
  })
}
</script>
