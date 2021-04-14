const { DataTypes, BaseModel } = require('../baseModel')

const Post = require('./article')
const Category = require('./category')

class CategoryPosts extends BaseModel {}

CategoryPosts.initModel(
  {
    post_id: {
      type: DataTypes.INTEGER,
      comment: '文章id',
    },
    post_name: {
      type: DataTypes.STRING,
      comment: '文章标题',
    },
    category_name: {
      type: DataTypes.STRING,
      comment: '分类名称',
    },
    category_id: {
      type: DataTypes.INTEGER,
      comment: '分类id',
    },
  },
  {
    tableName: 'xs_category_posts',
    comment: '文章和标签关系表',
  }
)

module.exports = CategoryPosts
