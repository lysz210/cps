module.exports = {
  extends: [
    '@nuxtjs/eslint-config-typescript'
  ],
  // root: true,
  // env: {
  //   browser: true,
  //   node: true
  // },
  // parserOptions: {
  //   parser: '@typescript-eslint/parser'
  // },
  // extends: [
  //   '@nuxtjs',
  //   'plugin:nuxt/recommended'
  // ],
  // plugins: [
  //   '@typescript-eslint'
  // ],
  // add your custom rules here
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    'nuxt/no-cjs-in-config': 'off',
    "vue/html-self-closing": 0,
    "no-console": ["error", { "allow": ["log", "error"]}]
  }
}
