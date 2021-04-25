const { Sequelize, BaseModel, DataTypes } = require('../baseModel')

class BtrorderDetail extends BaseModel {}

BtrorderDetail.initModel(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: '主键',
    },
    name: {
      type: DataTypes.STRING,
      comment: '订单名称',
    },
    picture: {
      type: DataTypes.STRING,
      comment: '项目图片',
    },
    type: {
      type: DataTypes.INTEGER,
      comment: '项目类型 1:普通用户，2:年会员，3:终身会员',
    },
    price: {
      type: DataTypes.DOUBLE,
      comment: '项目金额',
    },
    member: {
      type: DataTypes.STRING,
      comment: '项目使用者',
    },
    project: {
      type: DataTypes.STRING,
      comment: '消费项目',
    },
  },
  {
    tableName: 'xs_btr_order_detail',
    comment: '巴图尔会员订单明细',
  }
)

module.exports = BtrorderDetail
