const request = require('supertest')
const app = require('../../app')
const Repo = require('../../models/Repo')

describe('Test pinned github projects fetching', () => {
  const data = [
    {
      id: 'MDEwOlJlcG9zaXRvcnkzMDc4MjYwNDk=',
      title: 'SCS_RPC2',
      description: 'Discord Rich Presence plugin for ETS2 and ATS',
      stars: 2,
      homepageUrl: null,
      url: 'https://github.com/Tarasa24/SCS_RPC2',
      language: 'C++',
      languageCol: '#f34b7d',
      license: 'MIT License',
      licenseUrl: 'http://choosealicense.com/licenses/mit/',
      downloads: 28,
      img:
        'https://cdn.discordapp.com/app-assets/529016610137309184/529052463643230211.png',
    },
    {
      id: 'MDEwOlJlcG9zaXRvcnkyMTk2MDYwOTU=',
      title: 'FromReddit',
      description:
        'Twitch IRC chatbot for displaying r/AskReddit questions on demand',
      stars: 0,
      homepageUrl: null,
      url: 'https://github.com/Tarasa24/FromReddit',
      language: 'Python',
      languageCol: '#3572A5',
      license: null,
      licenseUrl: null,
      downloads: 28,
      img: 'https://i.imgur.com/s4eR1Vn.png',
    },
    {
      id: 'MDEwOlJlcG9zaXRvcnkzMjM5NTQ1Mjc=',
      title: 'Portfolio',
      description: 'Web portfolio made using Nuxt in conjunction with REST api',
      stars: 0,
      homepageUrl: 'https://tarasa24.dev',
      url: 'https://github.com/Tarasa24/Portfolio',
      language: 'Vue',
      languageCol: '#2c3e50',
      license: null,
      licenseUrl: null,
      downloads: -1,
      img: 'https://i.imgur.com/KBzZRUh.png',
    },
  ]

  beforeAll(async () => {
    // Shuffle array to ensure data is properly sorted in the next test
    let copy = [].concat(data)
    copy.sort(function () {
      return 0.5 - Math.random()
    })

    await Repo.sync({ force: true })
    await Repo.bulkCreate(copy)
  })

  test('It should return ordered list of projects', async () => {
    const response = await request(app).get('/gitSync')
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(data)
  })

  afterAll(async () => {
    await Repo.drop()
  })
})
