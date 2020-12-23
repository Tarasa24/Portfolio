const { Sequelize } = require('sequelize');

const db = new Sequelize('web', process.env.mysqlUser, process.env.mysqlPass, {
  host: 'mysql-slave.mysql.svc.cluster.local',
  dialect: 'mysql'
});

module.exports = {
  db
};