const request = require('supertest')

const nodemailer = require('nodemailer')

const app = require('../../app')

describe('/contact', () => {
  beforeAll(async () => {
    nodemailer.createTransport = jest.fn().mockReturnValue({
      sendMail: jest.fn().mockResolvedValue({})
    })
  })

  it('should return 200 on successful submission', async () => {
    const response = await request(app).post('/contact').send({
      name: 'John Doe',
      email: 'tarasa24@tarasa24.dev',
      text: 'Hello world!'
    })
    expect(response.status).toBe(200)
  })
  it('should return 400 on missing fields', async () => {
    const response = await request(app).post('/contact').send({
      text: 'Hello world!'
    })
    expect(response.status).toBe(400)

    const response2 = await request(app).post('/contact').send({
      name: 'John Doe'
    })
    expect(response2.status).toBe(400)

    const response3 = await request(app).post('/contact').send({
      email: ''
    })
    expect(response3.status).toBe(400)
  })
  it('should return 400 on invalid email', async () => {
    const response = await request(app).post('/contact').send({
      name: 'John Doe',
      email: 'tarasa24@tarasa24',
      text: 'Hello world!'
    })
    expect(response.status).toBe(400)
  })
  it('should return 500 on error and response body should contain error string', async () => {
    nodemailer.createTransport = jest.fn().mockReturnValue({
      sendMail: jest.fn().mockRejectedValue({})
    })
    const response = await request(app).post('/contact').send({
      name: 'John Doe',
      email: 'tarasa24@tarasa24.dev',
      text: 'Hello world!'
    })
    expect(response.status).toBe(500)
    expect(response.body.error).toBeDefined()
  })
})
