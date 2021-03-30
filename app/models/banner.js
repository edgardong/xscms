const {
  sequelize
} = require('../../core/db')
const {
  Sequelize,
  Model,
  Op
} = require('sequelize')

const {
  BannerItem
} = require('./bannerItem')

class Banner extends Model {
  static async getBanner(id) {
    let banners = await BannerItem.getBanners(id);
    BannerItem.prototype.exclude = ['banner_id', 'create_time']
    return banners;
  }
}

Banner.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    comment: 'Banner名称，通常为标识'
  },
  description: {
    type: Sequelize.STRING,
    comment: 'Banner描述'
  }
}, {
  sequelize,
  tableName: 'banner'
})

module.exports = {
  Banner
}