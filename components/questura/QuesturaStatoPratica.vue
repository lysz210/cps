<template>
  <v-card flat>
    <v-app-bar flat>
      <v-toolbar-title>{{ locale }} - {{ titolo }}</v-toolbar-title>
      <v-spacer />
      <v-btn icon mr-1 @click="$emit('refresh')">
        <v-icon>refresh</v-icon>
      </v-btn>
      <v-btn icon @click="$emit('close')">
        <v-icon>minimize</v-icon>
      </v-btn>
    </v-app-bar>
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
