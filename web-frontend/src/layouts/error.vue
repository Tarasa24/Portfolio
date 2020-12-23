<template>
  <main>
    <Top />
    <div>
      <h1>
        {{ error.statusCode }}
        {{ error.statusCode === 404 ? $t('error.404') : $t('error.err') }}
      </h1>
      <nuxt-link :to="$i18n.locale == 'en' ? '/' : '/' + $i18n.locale">{{
        $t('error.home')
      }}</nuxt-link>
    </div>
  </main>
</template>

<script>
import Top from '../assets/svg/top.svg?inline'

export default {
  props: ['error'],
  layout: 'plain',
  components: { Top },
  head() {
    const i18nSeo = this.$nuxtI18nSeo()
    return {
      htmlAttrs: { ...i18nSeo.htmlAttrs },
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Full-Stack developer, Student and Tech geek',
        },
        {
          hid: 'viewport',
          name: 'viewport',
          content: 'width=device-width,initial-scale=1',
        },
        ...i18nSeo.meta,
      ],
      link: [...i18nSeo.link],
    }
  },
}
</script>

<style lang="sass" scoped>
main
  width: 100%
  height: 100vh
  display: grid
  align-items: center
  justify-items: center¨

svg
  width: 100%
  height: auto
  border-top: 45px solid $bg-color
  position: fixed
  top: 0

div
  width: max-content
  margin: auto

h1
  margin: 0
</style>
