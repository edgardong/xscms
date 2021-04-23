const {
  Sequelize,
  BaseModel,
  sequelize,
  getLastPage,
  DataTypes,
  Op,
} = require('../baseModel')


class Btrmember extends BaseModel {

}

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
    },
    address: {
      type: Sequelize.STRING(32),
      comment: '用户地址',
    },
    type: {
      type: DataTypes.INTEGER,
      comment: '会员类型 1:普通用户，2:年会员，3:终身会员',
    },
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
      comment: '订单状态 1:未支付，2:已支付，3:已发货，4:已支付，但库存不足',
    },
    price: {
      type: DataTypes.DOUBLE,
      comment: '会员余额',
    },
    level: {
      type: DataTypes.INTEGER,
      comment: '会员等级',
    },
  },
  {
    sequelize,
    tableName: 'xs_btr_member',
    comment: '巴图尔会员',
  }
)

module.exports = Btrmember
