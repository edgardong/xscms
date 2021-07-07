// const {
//   sequelize,
//   DataTypes,
//   Op,
//   BaseModel
// } = require('./baseModel')

// class AppToken extends BaseModel {}

// AppToken.initModel({
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//     comment: '主键'
//   },
//   access_token: {
//     type: DataTypes.STRING,
//     comment: 'token值'
//   },
//   expires_in: {
//     type: DataTypes.STRING,
//     comment: '有效期'
//   },
//   start_time: {
//     type: DataTypes.DATE,
//     comment: '有效期开始时间'
//   },
//   appid: {
//     type: DataTypes.STRING,
//     comment: '对应的app'
//   },
//   description: {
//     type: DataTypes.STRING,
//     comment: '描述'
//   }
// }, {
//   tableName: 'xs_app_token',
//   comment:'第三方APP的授权信息'
// })

// module.exports = AppToken