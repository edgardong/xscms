const {
  Sequelize,
  Model
} = require('sequelize')
const {
  unset,
  clone,
  isArray
} = require('lodash')
const {
  sequelize
} = require('../../core/db')

class Image extends Model {
  static async getImage(id) {
    let image = await Image.findByPk(id)
    return image
  }
}

Model.prototype.toJSON = function () {

  const {
    Product
  } = require('./product')

  const {
    Order
  } = require('./order')

  let data = clone(this.dataValues)
  unset(data, 'update_time')
  unset(data, 'delete_time')
  if (this instanceof Image) {
    if (!data.url.startsWith('http')) {
      data.url = global.config.imagePrefix + data.url
    }
  } else if (this instanceof Product) {
    if (!data.main_img_url.startsWith('http')) {
      data.main_img_url = global.config.imagePrefix + data.main_img_url
    }
  } else if (this instanceof Order) {
    data.snap_address = JSON.parse(data.snap_address)
    data.snap_items = JSON.parse(data.snap_items)
  }

  if (isArray(this.exclude)) {
    this.exclude.forEach(d => {
      unset(data, d)
    })
  }
  return data
}

Image.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '主键'
  },
  from: {
    type: Sequelize.INTEGER,
    comment: '1 来自本地，2 来自网络'
  },
  url: {
    type: Sequelize.STRING(255),
    comment: '图片路径',
    // get() {
    //   let from = this.getDataValue('from')
    //   let url = this.getDataValue('url')

    //   console.log('图片路径啊', global.config.imagePrefix, from, url)
    //   return from == 1 ? global.config.imagePrefix + url : global.config.imagePrefix + url
    // }
  }
}, {
  sequelize,
  tableName: 'xs_image',
  comment:'图片表'
})

module.exports = Image