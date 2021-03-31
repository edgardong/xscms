const {
  Sequelize,
  Model,
  Op
} = require('sequelize')
const {
  sequelize
} = require('../../core/db')

const {
  Image
} = require('./image')

class ProductImage extends Model {}

ProductImage.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '主键'
  },
  img_id: {
    type: Sequelize.INTEGER,
    comment: '外键，关联图片'
  },
  order: {
    type: Sequelize.INTEGER,
    comment: '排序'
  },
  product_id: {
    type: Sequelize.INTEGER,
    comment: '商品ID'
  }
}, {
  sequelize,
  tableName: 'xs_product_image',
  comment:'产品表'
})

ProductImage.hasOne(Image, {
  foreignKey: 'id',
  sourceKey: 'img_id',
  as: 'img_url'
})

module.exports = {
  ProductImage
}