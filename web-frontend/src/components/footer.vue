<template>
  <footer>
    <button @click="toTop()" aria-label="Take to the top">
      <fa :icon="['fas', 'angle-double-up']" />
    </button>
    <span>Petr "<b>Tarasa24</b>" Gajdošík &copy;2020</span>
  </footer>
</template>

<script>
export default {
  methods: {
    toTop() {
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    },
  },
}
</script>

<style lang="sass" scoped>
footer
  position: absolute
  width: 100%
  bottom: 0
  background-color: rgba($bg-color, .95)
  color: white
  display: grid
  justify-items: center
  button
    position: relative
    bottom: calc((2rem + 20px) / 2)
    background-color: $gh-blue
    border: 0
    border-radius: 50%
    padding: 4px 12px 6px 12px
    margin: 5px 0
    cursor: pointer
    svg
      color: white
      font-size: 2rem
    @include small-device
      padding: 4px 11px 6px 11px
      bottom: 25px
      svg
        font-size: 2rem
  span
    margin-top: -20px
    margin-bottom: 15px
    font-size: .8rem
    color: $grey
</style>
