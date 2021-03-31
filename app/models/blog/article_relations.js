const {
  sequelize,
  DataTypes,
  BaseModel
} = require('../baseModel')

const BlogTag = require('./tags')

class ArticleRelations extends BaseModel {

  /**
   * 更新关系表
   * @param {object} data 需要更新的数据
   */
  static async updateRelation(data) {
    // 1. 更新article_category
    let artCate = await ArticleRelations.findOne({
      where: {
        key: data.article,
        type: 'article_category'
      }
    })

    let artCateData = {
      values: data.categorys.join(','),
      name: data.article + '_'
    }

    if (artCate) {
      ArticleRelations.update(artCateData, {
        where: {
          type: 'article_category',
          key: data.article
        }
      })
    } else {
      ArticleRelations.create(artCateData)
    }

    // 2. 更新article_tag
    let artTag = await ArticleRelations.findOne({
      where: {
        key: data.article,
        type: 'article_tag'
      }
    })

    let artTagData = {
      values: data.tags.join(','),
      name: data.article + '_',
      type: 'article_tag',
      key: data.article,
    }

    if (artTag) {
      ArticleRelations.update(artTagData, {
        where: {
          type: 'article_tag',
          key: data.article
        }
      })
    } else {
      ArticleRelations.create(artTagData)
    }
    // 3. 更新category_article
    data.categorys.forEach(async cate => {
      if (cate) {
        let where = {
          key: cate,
          type: 'category_article'
        }
        let dbCate = await ArticleRelations.findOne({
          where
        })

        if (dbCate) {
          let values = dbCate.values.split(',')
          if (values.indexOf(data.article) <= -1) {
            values.push(data.article)

            ArticleRelations.update({
              values: values.join(',')
            }, {
              where
            })
          }
        } else {
          ArticleRelations.create({
            values: [data.article].join(','),
            name: data.article + '_',
            ...where
          })
        }
      }
    })

    data.tags.forEach(async tag => {
      // 4. 更新tag_article
      if (tag) {
        let where = {
          key: tag,
          type: 'tag_article'
        }
        let dbTagArt = await ArticleRelations.findOne({
          where
        })

        if (dbTagArt) {
          let values = dbTagArt.values.split(',')
          if (values.indexOf(data.article) <= -1) {
            values.push(data.article)

            ArticleRelations.update({
              values: values.join(',')
            }, {
              where
            })
          }
        } else {
          ArticleRelations.create({
            values: [data.article].join(','),
            name: data.article + '_',
            ...where
          })
        }

        // 5. 更新tag表
        let tagData = {
          name: tag,
          count: 1
        }
        let dbTag = await BlogTag.findOne({
          where: {
            status: 0,
            name: tag
          }
        })
        if (dbTag) {
          tagData.count = dbTag.count + 1
          await BlogTag.update(tagData, {
            where: {
              id: dbTag.id
            }
          })
        } else {
          await BlogTag.create(tagData)
        }
      }
    })
  }
}

ArticleRelations.initModel({
  type: {
    type: DataTypes.STRING,
    comment: '关系类型/article_category/article_tag/category_article/tag_article'
  },
  key: {
    type: DataTypes.STRING,
    comment: '关键的id'
  },
  article: {
    type: DataTypes.INTEGER,
    comment: '文章id'
  },
  values: {
    type: DataTypes.STRING,
    comment: '值，以,隔开'
  }
}, {
  tableName: 'xs_article_relations',
  comment: '文章分类关系表'
})

module.exports = ArticleRelations