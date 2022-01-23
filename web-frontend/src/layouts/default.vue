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
