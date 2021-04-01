const { DataTypes } = require('sequelize')
const { db } = require('../config')

const Repo = db.define(
  'Repo',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    stars: DataTypes.INTEGER,
    homepageUrl: DataTypes.STRING,
    url: DataTypes.STRING,
    lang: DataTypes.STRING,
    langColor: DataTypes.STRING,
    license: DataTypes.STRING,
    licenseUrl: DataTypes.STRING,
    downloads: DataTypes.INTEGER,
    img: DataTypes.STRING,
  },
  {
    tableName: 'Repo',
    timestamps: false,
  }
)

module.exports = Repo
