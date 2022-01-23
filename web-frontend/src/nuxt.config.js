export default {
  server: {
    host: '0.0.0.0',
    port: 8080,
  },
  target: 'server',
  css: ['~assets/sass/global.sass'],
  components: true,
  buildModules: [],
  plugins: ['~plugins/loadVueComponent.js'],
  modules: [
    '@nuxtjs/style-resources',
    '@nuxtjs/svg',
    'nuxt-compress',
    [
      'nuxt-fontawesome',
      {
        component: 'fa',
        imports: [
          {
            set: '@fortawesome/free-brands-svg-icons',
            icons: ['fab'],
          },
          {
            set: '@fortawesome/free-solid-svg-icons',
            icons: ['fas'],
          },
          {
            set: '@fortawesome/free-regular-svg-icons',
            icons: ['far'],
          },
        ],
      },
    ],
    [
      'nuxt-i18n',
      {
        locales: [
          { code: 'cs', iso: 'cs', flag: 'cz' },
          { code: 'en', iso: 'en', flag: 'gb', isCatchallLocale: true },
        ],
        defaultLocale: 'en',
        seo: true,
        vueI18n: {
          fallbackLocale: 'en',
          messages: {
            en: require('./assets/lang/en.json'),
            cs: require('./assets/lang/cs.json'),
          },
        },
      },
    ],
    ['@nuxtjs/google-gtag', { id: 'UA-164343382-1' }],
  ],
  build: {},
  styleResources: {
    sass: ['./assets/sass/*.sass'],
  },
}
