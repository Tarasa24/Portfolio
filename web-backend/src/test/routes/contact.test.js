const { response } = require('express')
const request = require('supertest')
const axios = require('axios')
axios.defaults.adapter = require('axios/lib/adapters/http')
const app = require('../../app')

describe('Test faulty input', () => {
  test('It should respond 400 with no body', async () => {
    const response = await request(app).post('/contact')
    expect(response.statusCode).toBe(400)
  })
  test('It should respond 400 with missing name field', async () => {
    const response = await request(app)
      .post('/contact')
      .send({ email: 'test@example.com', text: 'lorem ipsum' })
    expect(response.statusCode).toBe(400)
  })
  test('It should respond 400 with missing email field', async () => {
    const response = await request(app)
      .post('/contact')
      .send({ name: 'Test', text: 'lorem ipsum' })
    expect(response.statusCode).toBe(400)
  })
  test('It should respond 400 with missing text field', async () => {
    const response = await request(app)
      .post('/contact')
      .send({ name: 'Test', email: 'test@example.com' })
    expect(response.statusCode).toBe(400)
  })
})

describe('Test correct input', () => {
  const mail = {
    name: 'Test',
    email: 'test@example.com',
    text: 'lorem ipsum',
  }
  let response

  beforeAll(async () => {
    response = await request(app)
      .post('/contact')
      .send(mail)
      .set('Accept', 'text/plain')
  })

  test('It should respond 200', async () => {
    expect(response.statusCode).toBe(200)
  })
  test('It should return correct email body fethced from Ethereal fake SMTP', async () => {
    const etherealResponse = await axios(response.text + '/message.eml')
    console.log(etherealResponse.data);
    expect(
      [
        `From: tarasa24@tarasa24.dev`,
        `To: tarasa24@tarasa24.dev`,
        `Reply-To: ${mail.name} <${mail.email}>`,
        mail.text,
      ].every((i) => etherealResponse.data.includes(i))
    ).toBe(true)
  })
})
