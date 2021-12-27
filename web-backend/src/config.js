const { Sequelize } = require('sequelize')

let db
if (process.env.NODE_ENV === 'production')
  db = new Sequelize('web', process.env.dbUser, process.env.dbPass, {
    host: process.env.dbHost,
    dialect: 'mysql',
    logging: false,
  })
else if (process.env.NODE_ENV === 'test')
  db = new Sequelize('sqlite::memory:', { logging: false })
else
  db = new Sequelize({
    dialect: 'sqlite',
    storage: './sqlite.db',
  })

module.exports = {
  db,
}
