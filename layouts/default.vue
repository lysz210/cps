<template>
  <v-app>
    <i18n-nav-drawer />
    <v-app-bar
      app
    >
      <!-- <v-toolbar-side-icon @click="drawer = !drawer" /> -->
      <v-btn class="mr-2" outlined small rounded @click.stop="drawer = !drawer">
        {{ $i18n.locale }}
      </v-btn>
      <v-toolbar-title ml-2>
        {{ $t('cps.titolo') }}
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container>
        <questura-search />
        <nuxt />
      </v-container>
    </v-content>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              compare_arrows
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import consola from 'consola'

@Component({
  components: {
    QuesturaSearch: () => import('~/components/questura/QuesturaSearch.vue'),
    I18nNavDrawer: () => import('~/components/i18n-nav.vue')
  }
})
export default class LayoutDefault extends Vue {
  clipped: boolean = true

  drawer: boolean = true

  fixed: boolean = false

  miniVariant: boolean = false

  right: boolean = true

  rightDrawer: boolean = false

  mounted () {
    consola.info(process.env.QUESTURA_API_URL)
  }
}
</script>
