const {
  Sequelize,
  Model,
  sequelize,
  DataTypes,
  Op
} = require('./baseModel')

const {
  generateToken
} = require('../../core/util')

class ThirdApp extends Model {
  static async getAppToken(params) {
    const app = await ThirdApp.findOne({
      where: {
        app_id: params.ac,
        app_secret: params.se
      }
    })

    if (app) {
      return generateToken(app.id, app.scope)
    }

    return ''
  }
}

ThirdApp.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    comment: '主键'
  },
  app_id: {
    type: DataTypes.STRING(64),
    comment: '应用app_id'
  },
  app_secret: {
    type: DataTypes.STRING(64),
    comment: '应用密钥'
  },
  app_description: {
    type: DataTypes.STRING(100),
    comment: '应用描述'
  },
  scope: {
    type: DataTypes.STRING(20),
    comment: '应用权限'
  },
  scope_description: {
    type: DataTypes.STRING(100),
    comment: '权限描述'
  }
}, {
  sequelize,
  tableName: 'xs_third_app',
  comment:'第三方APP'
})

module.exports = ThirdApp