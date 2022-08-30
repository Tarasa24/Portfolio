<template>
  <main>
    <span class="bar">
      <span
        class="language"
        v-for="lang in this.langs"
        :key="lang.language"
        :style="{
          backgroundColor: lang.color,
          width: round(lang.ratio * 100, 1) + '%'
        }"
      />
      <span
        v-if="this.langs.reduce((pv, cv) => pv + cv.ratio, 0) < 1"
        class="language"
        :style="{
          backgroundColor: '#dadada',
          width:
            round(
              (1 - this.langs.reduce((pv, cv) => pv + cv.ratio, 0)) * 100,
              1
            ) + '%'
        }"
      />
    </span>

    <div class="languages">
      <span v-for="lang in this.langs" :key="lang.language" class="language">
        <fa :icon="['fas', 'circle']" :style="{ color: lang.color }" />
        <span>{{ lang.language }}</span>
        <span class="percentage">{{ round(lang.ratio * 100, 1) }}%</span>
      </span>
      <span
        v-if="this.langs.reduce((pv, cv) => pv + cv.ratio, 0) < 1"
        class="language"
      >
        <fa :icon="['fas', 'circle']" :style="{ color: '#dadada' }" />
        <span>Other</span>
        <span class="percentage"
          >{{
            round(
              (1 - this.langs.reduce((pv, cv) => pv + cv.ratio, 0)) * 100,
              1
            )
          }}%</span
        >
      </span>
    </div>
  </main>
</template>

<script>
export default {
  props: ['langs'],
  methods: {
    round(value, precision) {
      var multiplier = Math.pow(10, precision || 0)
      return Math.round(value * multiplier) / multiplier
    }
  }
}
</script>

<style lang="sass" scoped>
.bar
  display: flex
  height: 8px
  border-radius: 6px
  outline: 1px solid transparent
  overflow: hidden
  .language
    margin-left: 2px
    &:first-of-type
      margin-left: 0

.languages
  margin-top: 5px
  .language
    margin-right: 10px
    &:last-of-type
      margin-right: 0
    span:last-of-type
      color: grey
      font-size: 12px
    .percentage
      @include medium-device
        display: none
</style>
