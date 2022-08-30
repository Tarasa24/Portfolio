<template>
  <nav class="desktop" v-if="width > 767" v-bind:class="{ right: menuBlock }">
    <navContent v-bind:class="{ block: menuBlock }" />
  </nav>
  <nav class="mobile" v-else>
    <button @click="openMenu"><fa :icon="['fas', 'bars']" /></button>
    <navContent :class="{ opened: menuOpened, closed: !menuOpened }" />
  </nav>
</template>

<script>
import navContent from './navContent'

export default {
  components: { navContent },
  data() {
    return {
      menuOpened: false,
      menuBlock: false,
      width: window.innerWidth,
      authorized: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize)
      window.addEventListener('scroll', this.onScroll)
    })
    this.onScroll()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
    window.removeEventListener('scroll', this.onScroll)
  },
  watch: {
    '$route.hash': function () {
      this.menuOpened = false
    }
  },
  methods: {
    openMenu() {
      this.menuOpened = !this.menuOpened
    },
    onResize() {
      this.width = window.innerWidth
    },
    onScroll() {
      this.menuBlock =
        document.querySelector('.brsvg').getBoundingClientRect().bottom <= 100

      function isInViewport(elem) {
        if (elem == null) return null
        const bounding = elem.getBoundingClientRect()
        return (
          bounding.top >= 0 &&
          bounding.left >= 0 &&
          bounding.bottom <=
            (window.innerHeight || document.documentElement.clientHeight) &&
          bounding.right <=
            (window.innerWidth || document.documentElement.clientWidth)
        )
      }

      const hs = ['About', 'Projects', 'Contact']
      let found = document.querySelector('.highlighted')
      for (let i = 0; i < hs.length; i++) {
        const h = document.querySelector(`#${hs[i]} h1`)
        const nav = document.querySelector(`nav a[href='#${hs[i]}']`)
        if (isInViewport(h)) {
          nav.classList.add('highlighted')
          if (found !== nav) if (found) found.classList.remove('highlighted')
          found = nav
          break
        }
      }
    }
  },
  fetchOnServer: false
}
</script>

<style lang="sass">
nav
  position: fixed
  top: 0
  z-index: 99
  width: 100%
  text-align: right

.desktop
  .authorized
    display: none
    a
      opacity: 0
    &:hover
      a
        opacity: 1
  .home
    display: none
  a
    text-decoration: none
    color: white
    font-size: 16px
    margin: 5px
    padding: 20px 10px
    white-space: nowrap
    cursor: pointer
    span
      border-radius: 20%
      position: relative
      top: 5px

  section
    margin-top: 10px
    @include transition(all)

  .block
    text-align: right
    width: auto
    display: inline-block
    margin: 0
    padding: 5px 0
    .home
      display: block
    span
      display: grid
      margin: 0
    .flag-link
      position: relative
      height: 20px
    .flag
      position: absolute
      top: 0
      right: 0
    a
      text-decoration: none
      color: black
      font-size: 1.15rem
      padding: 10px
      display: block
      @include transition(all)
    .authorized
      display: block
    .highlighted
      padding-right: 30px

.mobile
  button
    font-size: 1.25rem
    padding: 9px 10px 6px 10px
    margin: 7.5px
    margin-bottom: 0
    background-color: $bg-light
    border: 1px black solid
    border-radius: 5px
    cursor: pointer
  .closed
    display: none
  .opened
    display: block
  section
    text-align: center
    background-color: $bg-light
    width: fit-content
    margin-right: 7.5px
    margin-left: auto
    padding: 5px 20px
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,.2)
    span
      display: grid
    .flag
      margin: auto
    a
      text-decoration: none
      color: black
      font-size: 1.3rem
      display: block
      padding: 10px 0
    .authorized
      display: block
      border-top: 1px $grey solid
      margin-top: 5px
    .flag-link
      padding: 0

.right
  right: 0
  width: 150px
</style>
