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
          href="mailto:tarasa24@tarasa24.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          <fa :icon="['fas', 'envelope']" title="Mail" />
        </a>
        <a @click="copyDiscord">
          <fa :icon="['fab', 'discord']" title="Discord" />
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
        <p>
          {{ $t('about.text') }}
        </p>

        <b>{{ $t('about.technical_skills.h') }}:</b>
        <ul>
          <li>NodeJS, Python, C++, C, C#</li>
          <li>Vue, Express</li>
          <li>MongoDB, MySQL</li>
          <li>Nginx</li>
          <li>Docker, Kubernetes</li>
          <li>Git, CI/CD</li>
          <li>Linux based server management</li>
        </ul>
        <b>{{ $t('about.education.h') }}:</b>
        <ul>
          <li>{{ $t('about.education.1') }}</li>
          <li>{{ $t('about.education.2') }}</li>
        </ul>
        <b>{{ $t('about.languages.h') }}:</b>
        <ul>
          <li>{{ $t('about.languages.1') }}</li>
          <li>{{ $t('about.languages.2') }}</li>
          <li>{{ $t('about.languages.3') }}</li>
        </ul>

        <div class="resume">
          <h5>
            {{ $t('about.resume') }}
          </h5>
          <a
            href="/resume.pdf"
            class="link"
            aria-label="Resume.pdf donwload link"
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

        <div class="container">
          <div
            v-for="project in projects"
            :key="project.id"
            class="box project"
          >
            <img :src="project.img" :alt="project.title" />
            <section>
              <h3>{{ project.title }}</h3>
              <i>{{ project.description }}</i>
              <div>
                <span>
                  <fa :icon="['fas', 'star']" />
                  {{ project.stars }}
                </span>
                <span v-if="project.downloads !== -1">
                  <a
                    :href="project.url + '/releases'"
                    target="_blank"
                    rel="noopener noreferrer"
                    :aria-label="`${project.title} releases`"
                  >
                    <fa :icon="['fas', 'download']" />
                  </a>
                  {{ project.downloads }}
                </span>
                <span v-if="project.license" class="license">
                  <a
                    :href="project.licenseUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    :aria-label="`${project.title} license link`"
                  >
                    <fa :icon="['fas', 'balance-scale']" />
                  </a>
                  {{ project.license }}
                </span>
                <span>
                  <fa
                    :icon="['fas', 'circle']"
                    :style="{ color: project.langColor }"
                  />
                  {{ project.lang }}
                </span>
              </div>
            </section>
            <span class="links">
              <a
                v-if="project.homepageUrl"
                :href="project.homepageUrl"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="`${project.title} Homepage`"
              >
                <fa :icon="['fas', 'external-link-alt']" />
              </a>
              <a
                :href="project.url"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="`${project.title} Github`"
              >
                <fa :icon="['fab', 'github']" />
              </a>
            </span>
          </div>

          <div v-if="projects.length == 0">
            <Spinner />
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
            <section>
              <a
                href="https://github.com/Tarasa24"
                target="_blank"
                rel="noopener noreferrer"
              >
                <fa :icon="['fab', 'github']" /> <b>Github</b> (@Tarasa24)
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
              <a @click="copyDiscord">
                <fa :icon="['fab', 'discord']" />
                <b>Tarasa24</b>#1761
              </a>
            </section>
            <section class="box">
              <h2>{{ $t('contact.availability') }}</h2>
              <b>{{ $t('contact.available') }}</b>
            </section>
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

import fetchApi from '../assets/js/fetchApi'

export default {
  components: { Top, Terminal, Mid1, Mid2, Spinner },
  data() {
    return {
      projects: [],
      state: 0,
    }
  },
  head() {
    return { title: 'Petr "Tarasa24" Gajdošík | Portfolio' }
  },
  async fetch() {
    this.projects = await fetchApi('/gitsync')
  },
  fetchOnServer: false,
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
    async handleSubmit() {
      this.state = 2
      event.preventDefault()
      let res = await fetchApi('/contact', 'POST', {
        name: event.target.elements.name.value,
        email: event.target.elements.email.value,
        text: event.target.elements.text.value,
        lang: this.$i18n.locale,
      })

      switch (res) {
        case 200:
          this.state = 2
          break
        default:
          this.state = -1
          break
      }
    },
  },
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
  .link
    text-decoration: underline
    color: black
  ul
    margin: 5px 0
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
      height: 130px
      margin: 10px auto
      display: grid
      grid-template-columns: 130px auto 15%
      align-items: center
      @include small-device
        width: 100%
        height: 98px
        grid-template-columns: 98px auto 15%
        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.3)
      img
        width: 128px
        justify-self: center
        @include small-device
          width: 90px
      section
        padding-left: 3%
        text-align: left
        h3
          margin: 10px 0
          font-size: 1.8rem
          @include small-device
            font-size: 1.2rem
        i
          @include small-device
            display: none
      div
        margin-top: 2%
        span
          margin: 0 3px
          white-space: nowrap
          &:first-of-type
            margin-left: 0
          svg
            color: $grey
            @include transition(color)
          a:hover
            svg
              color: $gh-blue
          @include small-device
            margin: 0 1px
        .license
          @include small-device
            display: none
      .links
        justify-self: center
        text-align: center
        a
          text-decoration: none
          color: $grey
          font-size: 3rem
          margin: auto
          @include small-device
            font-size: 2rem
          svg
            @include transition(color)
          &:hover
            svg
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
          justify-self: center
          text-align: center
          b
            color: green
          @include small-device
            width: 100%
            padding: 15px 0
            margin-bottom: 20px
</style>
