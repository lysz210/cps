<template>
  <v-navigation-drawer v-model="drawer" app>
    <v-list>
      <v-list-item
        v-for="locale in locales"
        :key="locale.code"
        :to="switchLocalePath(locale.code)"
        router
        exact
      >
        <v-list-item-action>{{ locale.code }}</v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-text="locale.native" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import query from '~/database/graphql/i18n/client/query.gql'

@Component({
  apollo: {
    locales: {
      query: query.Locales
    }
  }
})
export default class I18nNavDrawer extends Vue {
  locales: any[] = []
}
</script>
