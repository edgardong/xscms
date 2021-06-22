const {
  sequelize,
  DataTypes,
  Sequelize,
  Op,
  BaseModel,
  getPaginationList,
} = require('../baseModel')

class Page extends BaseModel {}



Page.initModel(
  {
    title: {
      type: DataTypes.STRING,
      comment: '文章标题',
    },
    url: {
      type: DataTypes.STRING,
      comment: '页面路径',
    },
    type: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      comment: '0: 已发布 1:草稿中',
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '文章状态 0: 可用 1:禁用',
    },
    content: {
      type: DataTypes.TEXT,
      comment: '文章内容',
    },
    content_type: {
      type: DataTypes.INTEGER,
      default: 1,
      comment: '内容类型：1, 富文本编辑 2, markdown编辑',
    },
    read_count: {
      type: DataTypes.INTEGER,
      comment: '阅读数量',
    },
    description: {
      type: DataTypes.STRING,
      comment: '页面简介',
    },
    image: {
      type: DataTypes.STRING,
      comment: '页面主图',
    },
    publish_time: {
      type: DataTypes.DATE,
      comment: '发布时间',
    },
  },
  {
    tableName: 'xs_page',
    comment: '页面表',
  }
)

// Article.hasOne(ArticleCategory, {
//   foreignKey: 'article',
//   sourceKey: 'id',
//   as: 'categorys'
// })

module.exports = Page