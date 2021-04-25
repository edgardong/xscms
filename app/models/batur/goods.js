const {
  Sequelize,
  BaseModel,
  sequelize,
  getLastPage,
  DataTypes,
  Op,
} = require('../baseModel')

class Btrgoods extends BaseModel {}

Btrgoods.initModel(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: '主键',
    },
    type: {
      type: DataTypes.INTEGER,
      comment: '会员类型 1:普通用户，2:年会员，3:终身会员',
    },
    price: {
      type: DataTypes.DOUBLE,
      comment: '商品价格',
    },
    in_price: {
      type: DataTypes.DOUBLE,
      comment: '商品进价',
    },
    level: {
      type: DataTypes.INTEGER,
      comment: '商品等级',
    },
    stock: {
      type: DataTypes.INTEGER,
      comment: '商品库存',
    },
    picture: {
      type: DataTypes.STRING,
      comment: '商品图片',
    },
  },
  {
    sequelize,
    tableName: 'xs_btr_goods',
    comment: '巴图尔商品',
  }
)

module.exports = Btrgoods
