<template>
  <v-card flat>
    <v-system-bar>
      <span>{{ titolo }}</span>
      <v-spacer />
      <v-icon @click="$emit('refresh')">
        refresh
      </v-icon>
      <v-icon @click="$emit('close')">
        minimize
      </v-icon>
      <strong>{{ locale }}</strong>
    </v-system-bar>
    <v-card-title>{{ descrizione }}</v-card-title>
    <v-card-text>{{ dataRichiesta }}</v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Component,
  Prop
} from 'vue-property-decorator'
import { IStatoPratica } from '~/my-lib/questura'

@Component
export default class QuesturaStatoPratica extends Vue {
  @Prop({
    required: true
  })
  pratica!: IStatoPratica

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
