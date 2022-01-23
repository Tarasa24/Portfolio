<template>
  <main>
    <Top class="brsvg" />
    <div class="main" v-if="this.project.attributes">
      <div class="head">
        <h1>{{ project.attributes.title }}</h1>
        <div class="stats">
          <span v-if="Number(project.attributes.stars) > 0">
            <fa :icon="['fas', 'star']" />
            {{ project.attributes.stars }}
          </span>
          <span v-if="project.attributes.downloads">
            <fa :icon="['fas', 'download']" />
            {{ project.attributes.downloads }}
          </span>
          <span v-if="project.attributes.license" class="license">
            <fa :icon="['fas', 'balance-scale']" />
            {{ project.attributes.license }}
          </span>
          <span>
            <a :href="this.project.attributes.repoURL" target="_blank" rel="noopener noreferrer">
              <fa :icon="['fab', 'github']" />
              Repository
            </a>
          </span>
        </div>
        <LanguageBar 
          v-if="project.attributes.lang && project.attributes.lang.length > 0"
          class="languageBar"
          :langs="project.attributes.lang" />
      </div>
      <div v-if="this.project.attributes.readme.length > 0" v-html="compiledMarkdown" class="body box" />
      <div v-else class="body box error">
        <b>{{ $t('readme.404') }}</b>
      </div>
    </div>
  </main>  
</template>

<script>
import fetchCMS from '../../assets/js/fetchCMS'
import Top from '../../assets/svg/top.svg?inline'

export default {
  components: { Top },
  async asyncData({ params }) {
    return {
      title: params.title,
      project: {},
      readme: null
    }
  },
  async fetch() {
    this.project = await fetchCMS(
      `/api/projects?locale=${this.$i18n.locale}&filters[title][$eq]=` + 
      this.title).then(res => res.json().then(json => {
        if (json.data.length === 0)
          return this.$nuxt.error({ statusCode: 404, message: "Not found" })
        return json.data[0]
      }))
  },
  head() {
    const i18nSeo = this.$nuxtI18nSeo()
    return {
      title: `${this.project.attributes ? this.project.attributes.title : this.title} - README`,
      htmlAttrs: { ...i18nSeo.htmlAttrs },
      meta: [
        {
          charset: 'UTF-8',
        },
        {
          hid: 'description',
          name: 'description',
          content: this.project.attributes ? this.project.attributes.description : '',
        },
        {
          hid: 'viewport',
          name: 'viewport',
          content: 'width=device-width,initial-scale=1',
        },
        {
          property: 'og:image',
          content: this.project.attributes ? this.project.attributes.imgURL : ''
        },
        ...i18nSeo.meta,
      ],
      link: [...i18nSeo.link],
    }
  },
  computed: {
    compiledMarkdown() {
      return require('marked').parse(this.project.attributes ? this.project.attributes.readme : '')
    }
  },
}
</script>

<style lang="sass" scoped>
.brsvg
  width: 100%
  height: auto

.main
  width: 60%
  margin: auto
  @include medium-device
    margin-left: 0
    width: 80%
  @include small-device
    width: 100%

.head
  margin-bottom: 10px
  padding: 0 20px
  h1
    text-align: center
    font-size: 3rem
    margin-bottom: 10px
  @include small-device
    display: block
    margin-bottom: 0
  .stats
    text-align: center
    margin-bottom: 20px
    span
      white-space: nowrap
      margin-right: 10px
      svg
        color: $grey
    a
      text-decoration: none
      color: black
      svg
        @include transition(color)
      &:hover
        svg
          color: black
  .languageBar
    width: 100%
    @include small-device
      margin-top: 10px

.error-body
  text-align: center
  display: grid
  a
    margin-top: 10px
    font-size: 3rem

.body
  width: 100%
  box-sizing: border-box
  margin: 0
  /deep/
    center
      text-align: left !important
      display: grid; 
      grid-template-columns: 128px auto 
      grid-template-rows: 73px 55px
      gap: 0px 20px
      grid-template-areas: "img ." "img ."
      img
        grid-area: img
        height: 128px
        max-width: 100%
      h1
        align-self: center
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis
        @include small-device
          font-size: 1.6rem
    hr
      height: 0.25em
      padding: 0
      margin: 0
      background-color: $grey
      border: 0
    blockquote
      margin: 0
      padding: 0 1em
      color: $bg-color
      border-left: 0.25em solid $grey
    a
      text-decoration: none
      color: $gh-blue
      &:hover
        text-decoration: underline
    h1, h2, h3, h4
      border-bottom: 1px solid $grey;
    img
      max-width: 100%

.error
  text-align: center
  padding: 20px 15px
  b
    color: $grey
</style>