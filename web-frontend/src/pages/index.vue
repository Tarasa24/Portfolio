<template>
  <main>
    <div class="head">
      <Terminal />
      <div class="links">
        <a
          href="https://github.com/Tarasa24"
          target="_blank"
          rel="noopener noreferrer"
        >
          <fa :icon="['fab', 'github']" title="Github" />
        </a>
        <a
          href="www.linkedin.com/in/petr-gajdošík-84b053236"
          target="_blank"
          rel="noopener noreferrer"
        >
          <fa :icon="['fab', 'linkedin']" title="LinkedIn" />
        </a>
        <a @click="copyDiscord">
          <fa :icon="['fab', 'discord']" title="Discord" />
        </a>
        <a
          href="mailto:tarasa24@tarasa24.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          <fa :icon="['fas', 'envelope']" title="Mail" />
        </a>
      </div>
      <div class="arrdown">
        <a href="#About">
          <fa :icon="['fas', 'angle-double-down']" />
          <span>{{ $t('about.h') }}</span>
        </a>
      </div>
    </div>

    <Top class="brsvg" />

    <div class="about">
      <div id="About" class="box">
        <h1>{{ $t('about.h') }}</h1>
        <div class="underline" />

        <div v-html="compiledMarkdown" class="about" />

        <div
          v-if="
            this.homepageData.data && this.homepageData.data.attributes.resume
          "
          class="resume"
        >
          <h5>
            {{ $t('about.resume') }}
          </h5>
          <a
            :href="
              '/cms' +
              this.homepageData.data.attributes.resume.data.attributes.url
            "
            class="link"
            :title="
              this.homepageData.data.attributes.resume.data.attributes.name
            "
            :aria-label="
              this.homepageData.data.attributes.resume.data.attributes.name +
              ' download link'
            "
          >
            <fa :icon="['far', 'file-alt']" />
          </a>
        </div>
      </div>

      <div class="arrdown">
        <a href="#Projects">
          <fa :icon="['fas', 'angle-double-down']" />
          <span>{{ $t('projects.h') }}</span>
        </a>
      </div>
      <br />
    </div>

    <div class="projects">
      <Mid1 class="brsvg" />

      <div id="Projects" class="box">
        <h1>{{ $t('projects.h') }}</h1>
        <div class="underline" />

        <div v-if="projects.data" class="container">
          <div
            v-for="project in projects.data"
            :key="project.id"
            class="cardContainer"
          >
            <div class="cardFlip">
              <div class="box project cardFront">
                <img
                  :src="project.attributes.imgURL"
                  :alt="project.attributes.title"
                />
                <section>
                  <h3>{{ project.attributes.title }}</h3>
                  <span>{{ project.attributes.description }}</span>
                  <div>
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

                    <LanguageBar
                      v-if="
                        project.attributes.lang &&
                        project.attributes.lang.length > 0
                      "
                      class="languageBar"
                      :langs="project.attributes.lang"
                    />
                  </div>
                </section>
              </div>

              <div class="box project cardBack">
                <img
                  :src="project.attributes.imgURL"
                  :alt="project.attributes.title"
                />
                <section>
                  <div class="links">
                    <a
                      :href="project.attributes.repoURL"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <fa :icon="['fab', 'github']" />
                      {{ $t('projects.links.repository') }}
                    </a>

                    <a
                      v-if="project.attributes.homepageURL"
                      :href="project.attributes.homepageURL"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <fa :icon="['fas', 'external-link-square-alt']" />
                      {{ $t('projects.links.website') }}
                    </a>

                    <nuxt-link
                      v-if="project.attributes.readme"
                      :to="localePath('/readme/' + project.attributes.title)"
                    >
                      <fa :icon="['fas', 'file-alt']" />
                      {{ $t('projects.links.readme') }}
                    </nuxt-link>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="arrdown">
        <a href="#Contact">
          <fa :icon="['fas', 'angle-double-down']" />
          <span>{{ $t('contact.h') }}</span>
        </a>
      </div>
    </div>

    <div id="Contact" class="contact">
      <Mid2 class="brsvg" />

      <div class="box">
        <h1>{{ $t('contact.h') }}</h1>
        <div class="underline" />

        <div class="container">
          <form @submit="handleSubmit" v-if="state === 0">
            <label for="name">{{ $t('contact.name') }}: <span>*</span></label>
            <input type="text" id="name" name="name" required />
            <label for="email">{{ $t('contact.email') }}: <span>*</span></label>
            <input type="email" id="email" name="email" required />
            <textarea
              name="text"
              id="text"
              :aria-label="$t('contact.message')"
              :placeholder="$t('contact.message')"
              required
            />
            <button type="submit">{{ $t('contact.send') }}</button>
          </form>
          <form class="centered" v-else-if="state === 1">
            <Spinner />
          </form>
          <form class="centered" v-else-if="state === 2">
            <span>
              <fa :icon="['fas', 'paper-plane']" />
              <h3>{{ $t('contact.sent') }}</h3>
            </span>
          </form>
          <form class="centered" v-else-if="state === -1">
            <span>
              <fa :icon="['fas', 'times']" />
              <h3>{{ $t('contact.error') }}</h3>
            </span>
          </form>

          <aside>
            <div>
              <section>
                <a
                  href="https://github.com/Tarasa24"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <fa :icon="['fab', 'github']" /> <b>Github</b> (@Tarasa24)
                </a>
                <a
                  href="www.linkedin.com/in/petr-gajdošík-84b053236"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <fa :icon="['fab', 'linkedin']" /> <b>LinkedIn</b> (Petr
                  Gajdošík)
                </a>
                <a @click="copyDiscord">
                  <fa :icon="['fab', 'discord']" />
                  <b>Tarasa24</b>#1761
                </a>
                <span>
                  <a
                    href="mailto:tarasa24@tarasa24.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <fa :icon="['fas', 'envelope']" />
                    <b>tarasa24</b>@tarasa24.dev
                  </a>
                  <a class="pgp" href="/pgpkey.txt">(PGP Key)</a>
                </span>
              </section>
              <section class="box">
                <h2>{{ $t('contact.availability') }}</h2>
                <div v-if="this.homepageData.data">
                  <b
                    v-if="this.homepageData.data.attributes.availability"
                    class="available"
                  >
                    {{ $t('contact.available') }}
                  </b>
                  <b v-else class="unavailable">{{
                    $t('contact.not_available')
                  }}</b>
                </div>
              </section>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import Terminal from '../components/terminal'
import Top from '../assets/svg/top.svg?inline'
import Mid1 from '../assets/svg/br1.svg?inline'
import Mid2 from '../assets/svg/br2.svg?inline'
import Spinner from '../assets/svg/spinner.svg?inline'
import LanguageBar from '../components/languageBar.vue'

import fetchAPI from '../assets/js/fetchAPI'
import fetchCMS from '../assets/js/fetchCMS'

export default {
  components: { Top, Terminal, Mid1, Mid2, Spinner, LanguageBar },
  data() {
    return {
      homepageData: {},
      projects: [],
      state: 0
    }
  },
  computed: {
    compiledMarkdown() {
      return require('marked').parse(
        this.homepageData.data ? this.homepageData.data.attributes.aboutMe : ''
      )
    }
  },
  head() {
    const i18nSeo = this.$nuxtI18nSeo()
    return {
      title: 'Petr Gajdošík (Tarasa24) | Portfolio',
      htmlAttrs: { ...i18nSeo.htmlAttrs },
      meta: [
        {
          charset: 'UTF-8'
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('seo.description')
        },
        {
          hid: 'viewport',
          name: 'viewport',
          content: 'width=device-width,initial-scale=1'
        },
        {
          property: 'og:image',
          content:
            'https://avatars0.githubusercontent.com/u/20138731?s=460&u=1866fe357bd941ea017959bc14297565d1d23483&v=4'
        },
        ...i18nSeo.meta
      ],
      link: [...i18nSeo.link]
    }
  },
  async fetch() {
    this.projects = await fetchCMS(
      `/api/projects?locale=${this.$i18n.locale}&sort[0]=downloads:DESC&sort[1]=stars:DESC`
    ).then((res) => res.json())
    this.homepageData = await fetchCMS(
      `/api/homepage?populate=resume&locale=${this.$i18n.locale}`
    ).then((res) => res.json())
  },
  methods: {
    copyDiscord() {
      this.$copyText('Tarasa24#1761').then(
        () => {
          alert(this.$t('notice.copied'))
        },
        () => {
          alert('Tarasa24#1761')
        }
      )
    },
    async handleSubmit(e) {
      this.state = 2
      e.preventDefault()
      let res = await fetchAPI('/contact', 'POST', {
        name: e.target.elements.name.value,
        email: e.target.elements.email.value,
        text: e.target.elements.text.value,
        lang: this.$i18n.locale
      })

      switch (res) {
        case 200:
          this.state = 2
          break
        default:
          this.state = -1
          break
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.head
  background-color: $bg-color
  padding-bottom: 20px
  .links
    text-align: center
    margin: auto
    margin-top: 10px
    a
      color: white
      cursor: pointer
      font-size: 1.5rem
      margin: 0 2px
      padding: 0 5px
      &:hover
        @include transition(color)
        color: $gh-blue
  .arrdown
    padding-top: 27.5vh
    a
      color: white

.about
  ::v-deep
    h2
      margin: 0
      strong
        font-size: 1.15rem
    ul
      margin: 5px 0
  .link
    text-decoration: underline
    color: black
  .resume
    text-align: center
    h5
      margin: 30px 0 8px 0
      font-weight: normal
    .link
      padding: 8px
      color: gray
      font-size: 50px
      @include transition(color)
      &:hover
        color: $gh-blue

.arrdown
  width: 100%
  position: relative
  top: 30px
  margin-top: 20px
  a
    color: black
    text-decoration: none
    font-size: 2rem
    padding: 20px
    display: grid
    justify-items: center
    span
      font-size: 1rem
      margin-top: 10px

.brsvg
  width: 100%
  height: auto

h1
  text-transform: uppercase

.cardContainer
  display: grid
  perspective: 700px

.cardFlip
  display: grid
  grid-template: 1fr / 1fr
  grid-template-areas: "frontAndBack"
  transform-style: preserve-3d
  transition: all 0.7s ease

.cardFront
  @include transition(opacity)
  opacity: 1
  background-color: white
  grid-area: frontAndBack
  pointer-events: none

.cardBack
  @include transition(opacity)
  opacity: 0
  background-color: white
  grid-area: frontAndBack
  transform: rotateX(-180deg)
  pointer-events: none

.cardContainer:hover .cardFlip
  transform: rotateX(180deg)
  .cardFront
    opacity: 0
  .cardBack
    opacity: 1
    pointer-events: all

.projects
  background-color: $bg-light
  @include small-device
    #Projects
      background-color: transparent
  .container
    margin-top: 2.5%
    text-align: center
    .project
      padding: 0
      width: 90%
      margin: 10px auto
      display: grid
      grid-template-columns: 130px auto
      align-items: center
      @include small-device
        width: 100%
        grid-template-columns: 98px auto
        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.3)
      img
        width: 128px
        justify-self: center
        @include small-device
          width: 90px
      section
        padding-left: 3%
        padding-right: 3%
        text-align: left
        h3
          margin: 10px 0
          font-size: 1.8rem
          @include small-device
            text-align: center
            font-size: 1.2rem
        i
          @include small-device
            display: none
      div
        @include medium-device
          display: flex
          align-items: center
          justify-content: center
          colum-gap: 10px
        margin-top: 2%
        span
          margin: 0 3px
          white-space: nowrap
          &:first-of-type
            margin-left: 0
          svg
            color: $grey
          @include small-device
            margin: 0 1px
      .languageBar
        width: 100%
        margin: 7.5px 0 10px 0
        @include small-device
          display: none

      .links
        text-align: center
        margin: auto
        z-index: 2
        a
          cursor: pointer
          padding: 10px
          margin: 0 5px
          text-decoration: none
          display: inline-grid
          color: black
          @include small-device
            padding: 0
            font-size: 12px
          &:hover
            svg
              color: $gh-blue
          svg
            justify-self: center
            font-size: 3rem
            @include small-device
              font-size: 2rem
            color: $grey
            @include transition(color)
            &:hover
              color: $gh-blue
.contact
  .container
    display: grid
    grid-template-columns: 50% 50%
    column-gap: 2%
    margin-top: 2.5%
    @include small-device
      grid-template-columns: 1fr
      row-gap: 5%
    form
      min-height: 350px
      label span
        color: red
        line-height: 8px
      input, textarea
        width: calc( 99% - 2 * 5px )
        border-radius: 5px
        padding: 5px
        font-size: 1.15rem
        margin-bottom: 5px
        border: 1px $grey solid
      textarea
        margin-top: 5px
        min-height: 10rem
        font-family: Roboto
        resize: vertical
      button
        width: 100%
        padding: 10px
        background-color: $bg-color
        color: white
        font-size: 1rem
        cursor: pointer
    .centered
      display: grid
      align-items: center
      justify-items: center
      span
        width: fit-content
        text-align: center
        svg
          margin: auto
          font-size: 2.5rem
    aside
      align-self: flex-start
      display: grid
      align-items: center
      section
        &:nth-of-type(1)
          display: grid
          a
            text-decoration: none
            color: black
            font-size: 1.25rem
            margin: 5px 0
            cursor: pointer
            @include transition(color)
            &:hover
              color: $gh-blue
          .pgp
            font-size: 0.8rem
        &:nth-of-type(2)
          margin-top: 30px
          justify-self: center
          text-align: center
          .available
            color: green
          .unavailable
            color: red
          @include small-device
            width: 100%
            padding: 15px 0
            margin-bottom: 20px
</style>
