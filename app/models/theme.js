const { Sequelize, Op, Model, sequelize } = require('./baseModel')

const Product = require('./product')
const Image = require('./image')

class Theme extends Model {
  static async getThemes(ids) {
    let idArr = ids.split(',')
    const themes = await Theme.findAll({
      where: {
        id: {
          [Op.in]: idArr,
        },
      },
      include: [
        {
          model: Image,
          as: 'head_img',
        },
        {
          model: Image,
          as: 'topic_img',
        },
      ],
    })

    // themes.forEach(theme => {
    //   theme.head_img.url = global.config.imagePrefix + theme.head_img.url
    //   theme.topic_img.url = global.config.imagePrefix + theme.topic_img.url
    // })
    return themes
  }
}

Theme.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: '主键',
    },
    name: {
      type: Sequelize.STRING(50),
      comment: '专题名称',
    },
    description: {
      type: Sequelize.STRING(255),
      comment: '专题描述',
    },
    topic_img_id: {
      type: Sequelize.INTEGER,
      comment: '主题图,外键',
    },
    head_img_id: {
      type: Sequelize.INTEGER,
      comment: '专题列表图，头图',
    },
  },
  {
    sequelize,
    tableName: 'xs_theme',
    comment: '专题',
  }
)

Theme.hasOne(Image, {
  sourceKey: 'head_img_id',
  foreignKey: 'id',
  as: 'head_img',
})

Theme.hasOne(Image, {
  sourceKey: 'topic_img_id',
  foreignKey: 'id',
  as: 'topic_img',
})

module.exports = Theme
