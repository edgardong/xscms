const { Sequelize, BaseModel, DataTypes } = require('../baseModel')

class BtrorderGoods extends BaseModel {}

BtrorderGoods.initModel(
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
    order:{
      type: Sequelize.INTEGER,
      comment:'订单ID'
    },
    picture: {
      type: DataTypes.STRING,
      comment: '商品图片',
    },
    type: {
      type: DataTypes.INTEGER,
      comment: '项目类型 1:普通用户，2:年会员，3:终身会员',
    },
    price: {
      type: DataTypes.DOUBLE,
      comment: '商品金额',
    },
    member: {
      type: DataTypes.STRING,
      comment: '项目使用者',
    },
    goods: {
      type: DataTypes.INTEGER,
      comment: '商品ID',
    },
  },
  {
    tableName: 'xs_btr_order_goods',
    comment: '巴图尔会员订单商品明细',
  }
)

module.exports = BtrorderGoods
