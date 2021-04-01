const { Sequelize } = require('sequelize')

let db
if (process.env.NODE_ENV === 'production')
  db = new Sequelize('web', process.env.mysqlUser, process.env.mysqlPass, {
    host: 'mysql-slave.mysql.svc.cluster.local',
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
