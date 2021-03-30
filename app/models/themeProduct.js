const {
  Sequelize,
  Op,
  Model,
  sequelize
} = require('./baseModel')

const {
  Theme
} = require('./theme')
const {
  Image
} = require('./image')
const {
  Product
} = require('./product')

class ThemeProduct extends Model {

  /**
   * 获取主题下的产品
   * @param {Integer} id 主题Id
   */
  static async getThemeProducts(id) {
    Product.prototype.exclude = ['from', 'create_time', 'category_id']
    const products = Theme.findOne({
      where: {
        id
      },
      include: [{
          model: Image,
          as: 'head_img'
        },
        {
          model: Image,
          as: 'topic_img'
        }, {
          model: Product,
          as: 'products',
          through: {
            attributes: []
          }
        }
      ]
    })

    return products
  }
}

ThemeProduct.init({
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    comment: '主键'
  },
  theme_id: {
    type: Sequelize.INTEGER,
    comment: '主题id'
  },
  product_id: {
    type: Sequelize.INTEGER,
    comment: '产品id'
  }
}, {
  sequelize,
  modelName: 'theme_product',
  tableName: 'theme_product'
})

ThemeProduct.belongsTo(Product, {
  foreignKey: 'product_id'
})

ThemeProduct.belongsTo(Theme, {
  foreignKey: 'theme_id'
})

Theme.belongsToMany(Product, {
  through: ThemeProduct,
  foreignKey: 'theme_id',
  as: 'products',
  constraints: false
})

Product.belongsToMany(Theme, {
  through: ThemeProduct,
  foreignKey: 'product_id',
  as: 'themes',
  constraints: false
})

module.exports = ThemeProduct