<template>
  <div class="nuxt">
    <Splash v-bind:class="{ loaded: loaded }" />
    <client-only>
      <Nav />
    </client-only>
    <Nuxt />
    <Footer />
  </div>
</template>

<script>
import Nav from '../components/nav'
import Splash from '../components/splash'
import Footer from '../components/footer'

export default {
  modules: { Nav, Splash, Footer },
  data() {
    return {
      loaded: false,
    }
  },
  head() {
    const i18nSeo = this.$nuxtI18nSeo()
    return {
      htmlAttrs: { ...i18nSeo.htmlAttrs },
      meta: [
        {
          charset: 'UTF-8',
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('seo.description'),
        },
        {
          hid: 'viewport',
          name: 'viewport',
          content: 'width=device-width,initial-scale=1',
        },
        {
          property: 'og:image',
          content:
            'https://avatars0.githubusercontent.com/u/20138731?s=460&u=1866fe357bd941ea017959bc14297565d1d23483&v=4',
        },
        ...i18nSeo.meta,
      ],
      link: [...i18nSeo.link],
    }
  },
  async mounted() {
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    }
    this.loaded = false
    await sleep(500)
    this.loaded = true
  },
}
</script>

<style lang="sass" scoped>
.nuxt
  position: relative
  min-height: calc(100vh - 10rem)
  padding-bottom: 10rem
</style>
