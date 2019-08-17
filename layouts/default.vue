<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list>
        <v-list-item
          v-for="locale in locales"
          :key="locale.code"
          :to="switchLocalePath(locale.code)"
          router
          exact
        >
          <v-list-item-action>
            {{ locale.code }}
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="locale.name + ': ' + locale.native" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
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
        <pre>
          {{ translations }}
        </pre>
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

<script>
import translationQuery from '../database/graphql/client/query-translation'
import localesQuery from '../database/graphql/client/query-locales'

export default {
  data() {
    return {
      translation: null,
      locales: [],
      clipped: true,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: 'apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'bubble_chart',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  },
  apollo: {
    locales: {
      query: localesQuery
    },
    translations: {
      query: translationQuery,
      variables: {
        locale: 'zh',
        group: 'cps'
      }
    }
  }
}
</script>
