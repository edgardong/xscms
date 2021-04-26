const {
  Sequelize,
  BaseModel,
  sequelize,
  getLastPage,
  DataTypes,
  Op,
} = require('../baseModel')

class Btrmember extends BaseModel {}

Btrmember.initModel(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: '主键',
    },
    mobile: {
      type: DataTypes.STRING,
      comment: '手机号',
      unique:true
    },
    address: {
      type: Sequelize.STRING(32),
      comment: '用户地址',
    },
    type: {
      type: DataTypes.INTEGER,
      comment: '会员类型 1:普通用户，2:年会员，3:终身会员',
    },
    price: {
      type: DataTypes.DOUBLE,
      comment: '会员余额',
    },
    level: {
      type: DataTypes.INTEGER,
      comment: '会员等级',
    },
    in_time: {
      type: DataTypes.DATE,
      comment: '加入时间',
      defaultValue: new Date(),
    },
    age: {
      type: DataTypes.INTEGER,
      comment: '会员年龄',
    },
    sex: {
      type: DataTypes.INTEGER,
      comment: '会员性别1:男2:女3:未知',
      defaultValue: 3,
    },
  },
  {
    sequelize,
    tableName: 'xs_btr_member',
    comment: '巴图尔会员',
  }
)

module.exports = Btrmember
