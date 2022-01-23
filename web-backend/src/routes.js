const contact = require('./routes/contact.js')

module.exports = (app) => {
  app.post('/contact', contact)

  return app
}
