const Sequelize = require('sequelize')

const {
  dbName,
  user,
  password,
  host,
  port,
  dbType
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
    underscored: true
  },
  // 添加这个配置
  dialectOptions: {
    charset: 'utf8mb4',
    dateStrings: true,
    typeCast: true
  }
}

const sequelize = new Sequelize(dbName, user, password, options)

sequelize.sync({
  force: false,
  alter: true
})

module.exports = {
  sequelize
}