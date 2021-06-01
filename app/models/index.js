// 按顺序加载数据库的model类

const ArticleRelations = require('./blog/article_relations')
const Article = require('./blog/article')
const BlogBase = require('./blog/base')
const CategoryPosts = require('./blog/category_posts')
const Category = require('./blog/category')
const Tag = require('./blog/tags')


/**
 * 初始化表格之间的关系
 */
function init() {
  // console.log('我来初始化表格关系了')

  Category.belongsToMany(Article, {
    through: 'xs_category_posts',
    foreignKey: 'category_id',
    otherKey: 'post_id',
    as: 'posts',
    constraints: false,
  })

  Article.belongsToMany(Category, {
    through: 'xs_category_posts',
    foreignKey: 'post_id',
    otherKey: 'category_id',
    constraints: false,
  })

  Tag.belongsToMany(Article, {
    through: 'xs_tag_posts',
    foreignKey: 'tag_id',
    otherKey: 'post_id',
    constraints: false,
  })

  Article.belongsToMany(Tag, {
    through: 'xs_tag_posts',
    foreignKey: 'post_id',
    otherKey: 'tag_id',
    constraints: false,
  })
}

module.exports = {
  init,
}
