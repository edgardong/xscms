const {
  Sequelize,
  Model,
  Op,
  getLastPage
} = require('./baseModel')
const {
  sequelize
} = require('../../core/db')

const {
  Image
} = require('./image')

class Category extends Model {
  static async getAll() {
    const categorys = await Category.findAll({
      include: [{
        model: Image,
        as: 'img'
      }]
    })
    return categorys
  }

  /**
   * 分页获取分类
   */
  static async getPagination(params) {
    let result = {
      data: [],
      total: 0,
      per_page: params.size,
      current_page: params.page,
      last_page: 0
    }

    Image.prototype.exclude = ['id', 'from','create_time']

    const products = await Category.findAndCountAll({
      include: [{
        model: Image,
        as: 'img'
      }],
      limit: params.size,
      offset: (params.page - 1) * params.size,
      order: [
        ['create_time', 'desc']
      ]
    })

    result.data = products.rows
    result.total = products.count
    result.last_page = getLastPage(result.total, result.per_page)

    return result
  }
}

Category.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '主键'
  },
  name: {
    type: Sequelize.STRING(50),
    comment: '分类名称'
  },
  topic_img_id: {
    type: Sequelize.INTEGER,
    comment: '图片'
  },
  description: {
    type: Sequelize.STRING(100),
    comment: '分类描述'
  },
  is_check_show: {
    type: Sequelize.BOOLEAN,
    comment: '审核是否显示'
  }
}, {
  sequelize,
  tableName: 'xs_category',
  comment:'产品分类'
})

Category.hasOne(Image, {
  sourceKey: 'topic_img_id',
  foreignKey: 'id',
  as: 'img'
})

module.exports = {
  Category
}