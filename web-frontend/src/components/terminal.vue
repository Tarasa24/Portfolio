<template>
  <div class="blurred">
    <div id="terminal1">
      <span> root@tarasa24.dev:$ </span>
      <span class="textfield">{{
        this.$i18n.locale === 'cs'
          ? 'echo Softwarový vývojář'
          : 'echo a Software Developer'
      }}</span>
      <span class="caret">_</span>
    </div>
    <div id="terminal2">
      <span> root@tarasa24.dev:$ </span>
      <span class="textfield"></span>
      <span class="caret">_</span>
    </div>
    <div class="iam">
      <span>{{
        this.$i18n.locale === 'cs'
          ? 'Jsem Softwarový vývojář'
          : 'I am a Software Developer'
      }}</span>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    if (process.browser) this.typing()
  },
  methods: {
    async typing() {
      function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
      }
      const textArr =
        this.$i18n.locale === 'cs'
          ? ['Student', 'Tech Enthusiast', 'Tarasa24']
          : ['a Student', 'a Tech Enthusiast', 'Tarasa24']

      const iam = document.querySelector('.iam span')
      const terminal1 = {
        textfield: document.querySelector('#terminal1 > .textfield'),
        root: document.getElementById('terminal1'),
      }
      const terminal2 = {
        textfield: document.querySelector('#terminal2 > .textfield'),
        root: document.getElementById('terminal2'),
      }
      const caret = document.querySelector('.caret')

      // Initial clear
      await sleep(1800)
      for (i = 0; i < 'clear'.length; i++) {
        terminal2.textfield.innerHTML += 'clear'.charAt(i)
        await sleep(75)
      }
      await sleep(200)
      terminal2.root.style.visibility = 'hidden'
      iam.innerHTML = this.$i18n.locale === 'cs' ? 'Jsem ' : 'I am '
      terminal1.textfield.innerHTML = ''
      terminal2.textfield.innerHTML = ''
      caret.style.visibility = 'visible'
      await sleep(1000)

      // Loop over I am's
      for (var e = 0; e < textArr.length; e++) {
        const text = textArr[e]
        for (var i = 0; i < 'echo '.length; i++) {
          terminal1.textfield.innerHTML += 'echo '.charAt(i)
          await sleep(25)
        }

        //Element typing
        for (i = 0; i < text.length; i++) {
          iam.innerHTML += text.charAt(i)
          terminal1.textfield.innerHTML += text.charAt(i)
          await sleep(75)
        }

        //Next line
        await sleep(500)
        caret.style.visibility = 'hidden'
        terminal2.root.style.visibility = 'visible'
        await sleep(1800)

        //Last element check
        if (e === textArr.length - 1) {
          break
        }

        //"clear" command
        for (i = 0; i < 'clear'.length; i++) {
          terminal2.textfield.innerHTML += 'clear'.charAt(i)
          await sleep(75)
        }
        await sleep(200)
        terminal2.root.style.visibility = 'hidden'
        iam.innerHTML = this.$i18n.locale === 'cs' ? 'Jsem ' : 'I am '
        terminal1.textfield.innerHTML = ''
        terminal2.textfield.innerHTML = ''
        caret.style.visibility = 'visible'
        await sleep(1000)
      }
    },
  },
}
</script>

<style lang="sass" scoped>
.blurred
  padding-top: 5px
#terminal1, #terminal2
  white-space: nowrap
  overflow: hidden
  display: table
  filter: blur(1.5px)
  font-family: monospace
  font-size: 15px
  padding-left: 5px
  span
    display: inline-block
    margin: 2px 0
    &:first-of-type
      color: #38FF38
  .textfield
    color: white
    margin-left: 7px
  .caret
    color: white
    animation: vimCaret 1s linear infinite
    color: transparent
  @include small-device-portrait
    font-size: .7rem

#terminal1
  .caret
    visibility: hidden

.iam
  text-align: center
  color: white
  font-family: monospace
  font-size: 65px
  margin-top: 200px
  @include small-device
    font-size: 2rem

@keyframes vimCaret
  0%, 50%
    background-color: rgba(255, 255, 255, 0.2)
  51%
    background-color: transparent
</style>
