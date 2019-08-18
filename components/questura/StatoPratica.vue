<template functional>
  <v-card flat>
    <v-app-bar flat>
      <v-toolbar-title>{{ props.response }}</v-toolbar-title>
      <v-spacer />
      <v-btn icon mr-1 @click="$emit('refresh')">
        <v-icon>refresh</v-icon>
      </v-btn>
      <v-btn icon @click="$emit('close')">
        <v-icon>visibility_off</v-icon>
      </v-btn>
    </v-app-bar>
  </v-card>
</template>
