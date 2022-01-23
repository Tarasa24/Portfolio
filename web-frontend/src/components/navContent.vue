<template>
  <section>
    <span v-if="$nuxt.$route.name.includes('index__')">
      <a @click="scrollTop()" class="home">
        <b>{{ $t('nav.home') }}</b>
      </a>
      <a href="#About">
        {{ $t('nav.about') }}
      </a>
      <a href="#Projects">
        {{ $t('nav.projects') }}
      </a>
      <a href="#Contact">
        {{ $t('nav.contact') }}
      </a>
    </span>

    <span v-else>
      <nuxt-link :to="localePath({ path: '/' })">
        {{ $t('nav.home') }}
      </nuxt-link>
    </span>

    <nuxt-link
      :key="locale.code"
      :to="switchLocalePath(locale.code).replace(/#.*/, '')"
      :aria-label="`Change language to ${locale.code}`"
      class="flag-link"
    >
      <country-flag :country="locale.flag" />
    </nuxt-link>
  </section>
</template>

<script>
export default {
  computed: {
    locale() {
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale)[0]
    },
  },
  methods: {
    scrollTop() {
      scrollTo(0, 0)
      history.pushState(
        '',
        document.title,
        window.location.pathname + window.location.search
      )
    },
  },
}
</script>

<style></style>
