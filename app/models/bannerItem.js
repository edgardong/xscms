const { sequelize } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

const  Image  = require('../models/image')

Image.prototype.exclude = ['create_time']

class BannerItem extends Model {
  static async getBanners(id) {
    let banners = await BannerItem.findAll({
      where: {
        banner_id: id,
      },
      include: [
        {
          model: Image,
          as: 'img',
        },
      ],
    })
    return banners
  }
}

BannerItem.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    img_id: {
      type: Sequelize.STRING,
      comment: '图片ID',
    },
    key_word: {
      type: Sequelize.STRING,
      comment: '关键字',
    },
    type: {
      type: Sequelize.INTEGER,
    },
    banner_id: {
      type: Sequelize.INTEGER,
    },
  },
  {
    sequelize,
    tableName: 'xs_banner_item',
    comment: '轮播图详情',
  }
)

BannerItem.hasOne(Image, {
  foreignKey: 'id',
  as: 'img',
})

module.exports = BannerItem
