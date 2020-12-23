<template>
  <main>
    <Top class="brsvg" />
    <div class="form">
      <fa class="padlock" :icon="['fas', 'lock']" />
      <h3>{{ $t('login.h1') }}</h3>
      <br />
      <button @click="handleClick">
        <fa :icon="['fab', 'github']" />
        {{ $t('login.login') }}
      </button>
    </div>
  </main>
</template>

<script>
import Top from '../../assets/svg/top.svg?inline'

export default {
  components: { Top },
  head() {
    return {
      title: 'Petr "Tarasa24" Gajdošík | Login',
      meta: [
        {
          hid: 'robots',
          name: 'robots',
          content: 'noindex',
        },
      ],
    }
  },
  methods: {
    handleClick() {
      const authHost =
        process.env.NODE_ENV == 'production'
          ? 'https://oauth.tarasa24.dev/start'
          : 'http://localhost:300'
      const redirectPath = new URL(document.location).searchParams.get('rd')
      window.location.href =
        authHost + (redirectPath ? `?rd=${redirectPath}` : '')
    },
  },
}
</script>

<style lang="sass" scoped>
.brsvg
  width: 100%
  height: auto
  border-top: 45px solid $bg-color

main
  .form
    text-align: center
    position: fixed
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    z-index: 9
    width: 320px
    display: grid
    padding: 20px
    border: 1px $grey solid
    .padlock
      font-size: 3rem
      text-align: center
      margin: auto
    h3
      text-align: center
      margin: 10px 0
    button
      color: white
      background-color: $bg-color
      cursor: pointer
      @include transition(all)

      width: 60%
      margin: auto
      display: grid
      grid-template-columns: 2rem auto
      align-items: center
      justify-items: center

      border: 2px solid rgba($bg-color, .7)
      border-radius: 25px
      padding: 2.5px 5px
      svg
        font-size: 2rem
        @include transition(color)
      &:hover
        padding-right: 10px
        padding-left: 10px
        width: calc( 60% + 15px )
        svg
          color: $gh-blue
</style>
