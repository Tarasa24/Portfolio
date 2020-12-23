<template>
  <div class="splash">
    <div class="loader" />
  </div>
</template>

<script>
export default {}
</script>

<style lang="sass" scoped>
.splash
  width: 100%
  height: 100vh
  z-index: 100
  position: fixed
  top: 0
  left: 0
  background-color: rgba($bg-color, .8)

.loaded
  animation: fade .6s linear
  opacity: 0
  visibility: hidden
.noscript
  text-align: center
  width: 100%
  color: white
.loader
  width: 120px
  height: 120px
  border: 16px solid $grey
  border-top: 16px solid $gh-blue
  border-radius: 50%
  animation: spin 2s linear infinite
  position: absolute
  left: calc(50% - 60px - 16px)
  top: calc(50% - 60px - 16px)
  @include small-device
    width: 90px
    height: 90px
    border: 10px solid $grey
    border-top: 10px solid $gh-blue
    left: calc(50% - 45px - 10px)
    top: calc(50% - 45px - 10px)

@keyframes spin
  0%
    transform: rotate(0deg)
  100%
    transform: rotate(360deg)
@keyframes fade
  0%
    opacity: 1
    visibility: visible
  100%
    opacity: 0
    visibility: hidden
</style>
