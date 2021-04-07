const Sequelize = require('sequelize')

const {
  dbName,
  user,
  password,
  host,
  port,
  dbType,
} = require('../config/config').database

const options = {
  dialect: dbType,
  host,
  port,
  logging: false,
  timezone: '+08:00',
  charset: 'utf8',
  collate: 'utf8_general_ci',
  define: {
    timestamps: true,
    paranoid: true,
    createdAt: 'create_time',
    updatedAt: 'update_time',
    deletedAt: 'delete_time',
    underscored: true,
  },
  // 添加这个配置
  dialectOptions: {
    charset: 'utf8mb4',
    dateStrings: true,
    typeCast: true,
  },
}

function initDB() {
  let sequelize = new Sequelize('', user, password, options)

  sequelize
    .query(
      ` CREATE DATABASE IF NOT EXISTS ${dbName}
        DEFAULT CHARACTER SET utf8
        DEFAULT COLLATE utf8_general_ci`
    )
    .then(function (data) {
      // code to run after successful creation.
      console.log('create database success', data)
    })
    .catch(function (err) {
      console.log('create database error: ', err.original.code)
    })
}

function createAdmin(){
  
}

const sequelize = new Sequelize(dbName, user, password, options)

sequelize.sync({
  force: false,
  alter: true,
})

module.exports = {
  sequelize,
  initDB,
}
