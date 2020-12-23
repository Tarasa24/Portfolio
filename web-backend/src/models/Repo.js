const { DataTypes } = require('sequelize');
const { db } = require('../config')

const Repo = db.define('Repos', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
  stars: {
    type: DataTypes.INTEGER,
  },
  homepageUrl: {
    type: DataTypes.STRING,
  },
  url: {
    type: DataTypes.STRING,
  },
  language: {
    type: DataTypes.STRING,
  },
  languageCol: {
    type: DataTypes.STRING,
  },
  license: {
    type: DataTypes.STRING,
  },
  licenseUrl: {
    type: DataTypes.STRING,
  },
  downloads: {
    type: DataTypes.INTEGER,
  },
  img: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'repos',
  timestamps: false
});

module.exports = Repo;