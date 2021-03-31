const {
  Sequelize,
  Op,
  Model,
  sequelize,
  getLastPage
} = require('./baseModel')

const {
  ProductImage
} = require('./productImage')

const {
  Theme
} = require('./theme')

class Product extends Model {
  static async getRecent(limit) {
    const products = await Product.findAll({
      limit,
      order: [
        ['create_time', 'desc']
      ]
    })
    products.forEach(pro => {
      pro.main_img_url = global.config.imagePrefix + pro.main_img_url
    })
    return products
  }

  static async getPorductByCategory(category_id) {
    const products = await Product.findAll({
      where: {
        category_id
      }
    })
    products.forEach(pro => {
      pro.main_img_url = global.config.imagePrefix + pro.main_img_url
    })
    return products
  }

  static async getPorductById(id) {
    const product = await Product.findOne({
      where: {
        id
      },
      include: [{
        model: ProductImage,
        as: 'imgs',
        include: ['img_url']
      }]
    })
    // product.main_img_url = global.config.imagePrefix + product.main_img_url
    return product
  }

  static async getPaginationProduct(params) {
    let result = {
      data: [],
      total: 0,
      per_page: params.size,
      current_page: params.page,
      last_page: 0
    }

    const products = await Product.findAndCountAll({
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

Product.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '主键'
  },
  name: {
    type: Sequelize.STRING(80),
    comment: '商品名称'
  },
  price: {
    type: Sequelize.DECIMAL(6, 2),
    comment: '价格，单位：分'
  },
  stock: {
    type: Sequelize.INTEGER,
    comment: '库存量'
  },
  category_id: {
    type: Sequelize.INTEGER,
    comment: '所属分类'
  },
  main_img_url: {
    type: Sequelize.STRING,
    comment: '主图ID，'
  },
  from: {
    type: Sequelize.INTEGER,
    comment: '图片来源，1:本地，2:公网'
  },
  summary: {
    type: Sequelize.STRING(50),
    comment: '摘要'
  },
  img_id: {
    type: Sequelize.INTEGER,
    comment: '图片外键'
  }
}, {
  sequelize,
  tableName: 'xs_product',
  comment:'产品表'
})

Product.hasMany(ProductImage, {
  sourceKey: 'id',
  foreignKey: 'product_id',
  as: 'imgs'
})

module.exports = {
  Product
}