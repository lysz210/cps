<template>
  <v-card flat>
    <v-system-bar>
      <strong>{{ locale }}</strong>
      -
      <span class="d-inline d-md-none">{{ idPratica }}</span>
      <span class="d-none d-md-inline">{{ titolo }}</span>
      <v-spacer />
      <v-icon @click="$emit('toggle')">
        {{ showDetails ? 'minimize' : 'crop_5_4' }}
      </v-icon>
    </v-system-bar>
    <v-card-title v-if="showDetails">
      {{ descrizione }}
    </v-card-title>
    <v-card-text v-if="showDetails">
      {{ dataRichiesta }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Component,
  Prop
} from 'vue-property-decorator'
import { IStatoPraticaDisplayable } from '../../types/lys'

@Component
export default class QuesturaStatoPratica extends Vue {
  @Prop({
    required: true
  })
  pratica!: IStatoPraticaDisplayable

  get showDetails () {
    return this.pratica.show
  }

  get idPratica () {
    return this.pratica.pratica
  }

  get locale () {
    return this.pratica.language
  }

  get dettaglio () {
    return this.pratica.item
  }

  get titolo () {
    return this.dettaglio.title
  }

  get descrizione () {
    return this.dettaglio.description
  }

  get dataRichiesta () {
    return this.dettaglio.pubDate
  }
}
</script>
