const {
  sequelize,
  DataTypes,
  Op,
  Model,
  BaseModel,
  getPaginationList
} = require('../baseModel')

const generatetSitemap = require('../../../core/sitemap')
const ArticleRelation = require('./article_relations')
const { pushPost } = require('../../services/push/baidu')

class Article extends BaseModel {
  static async getPaginationArticle(params) {
    const result = await getPaginationList(params, Article, params.type ? {} : {
      type: 0
    }, {
      attributes: {
        exclude: ['content']
      }
    })
    return result
  }

  /**
   * 获取最近的文章
   * @param
   * @returns {Promise<*>}
   */
  static async getLatestArticleList() {

    return await getPaginationList({page:1,size:10},Article,{},{attributes: {
        exclude: ['content']
      }})
  }

  /**
   * 获取热门文章
   * @returns {Promise<*>}
   */
  static async getHotArticleList() {

    return await getPaginationList({page:1,size:10,order:['read_count','desc']},Article,{},{attributes: {
        exclude: ['content']
      }})
  }


  /**
   * 获取相关文章
   * @returns {Promise<*>}
   */
  static async getRelevantArticleList(params) {
    return await Article.getArticleList(params)
  }



  static async getArticleList(params) {
    // console.log('getArticleList', params)
    params.page = params.page || 1
    params.size = params.size || 15
    if (params.category && params.category !== '') {
      const cateArtRealation = await ArticleRelation.findOne({
        where: {
          type: 'category_article',
          key: params.category,
          status: 0
        }
      })

      if (!cateArtRealation) {
        return []
      }
      // 分类中文章的ids
      const artIds = cateArtRealation.values.split(',').filter(a => a != '').map(a => ~~a)
      const {
        in: opIn
      } = Op

      const data1 = await getPaginationList(params, Article, {
        id: {
          [opIn]: artIds
        }
      }, {})

      return data1
    } else {
      // console.log('lailezheleil', params)
      return await Article.getPaginationArticle(params)
    }
  }

  static async saveArticle(data) {
    let result = {
      msg: '保存成功',
      data:''
    }

    let relations = [...data.categorys, ...data.halfcategorys]

    data.article.categorys = data.categorys.join(',')
    data.article.half_categorys = data.halfcategorys.join(',')
    data.article.tags = data.tags.join(',')

    let _id = null
    if (data.article.id) {
      // 更新文章主要信息
      _id = data.article.id
      // console.log(data, _id)
      await Article.update(data.article, {
        where: {
          id: _id
        }
      })
    } else {
      // console.log('??????', data.article)
      let _data = await Article.create(data.article)
      _id = _data.id
    }

    // console.log('我来这里了', _id)

    let relateData = {
      categorys: relations,
      article: _id,
      tags: data.tags
    }

    // 更新关系
    await ArticleRelation.updateRelation(relateData)
    result.data = _id
    return result

  }

  static async publishArticle(data) {
    // console.log('publish', data)
    let result = {
      msg: '发布成功'
    }
    let article = await Article.findByPk(data.id)
    if (article) {
      if (article.type != 0 || !article.publish_time) {
        let entity = {}
        if (article.type != 0) {
          entity.type = 0
        }
        if (!article.publish_time) {
          entity.publish_time = new Date()
        }
        await Article.update(entity, {
          where: {
            id: data.id
          }
        })
        // 第一次发布的时候，做百度推送（后续会用开关控制）
       await pushPost(['http://quzhaota.cn/article/'+ data.id+'.html'])
      }
    } else {
      result.msg = '发布失败'
    }
    // 更新站点地图
    const datas = await Article.findAll({
      where: {
        type: 0,
        status: 0
      },
      attributes:['id', 'publish_time']
    })
    // console.log(datas)
    generatetSitemap(datas.map(d => ({
      id: d.id,
      time: d.publish_time
    })))
    return result
  }
}

Article.initModel({
  id: {
    type: DataTypes.INTEGER,
    comment: '主键',
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    comment: '文章标题'
  },
  sub_title: {
    type: DataTypes.STRING,
    comment: '二级标题'
  },
  keywords: {
    type: DataTypes.STRING,
    comment: '二级标题'
  },
  type: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: '0: 已发布 1:草稿中'
  },
  categorys: {
    type: DataTypes.STRING,
    comment: '文章分类'
  },
  half_categorys: {
    type: DataTypes.STRING,
    comment: '文章分类_半选'
  },
  tags: {
    type: DataTypes.STRING,
    comment: '文章标签'
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '文章状态 0: 可用 1:禁用'
  },
  content: {
    type: DataTypes.TEXT,
    comment: '文章内容'
  },
  content_type: {
    type: DataTypes.INTEGER,
    default: 1,
    comment: '内容类型：1, 富文本编辑 2, markdown编辑'
  },
  author_id: {
    type: DataTypes.INTEGER,
    comment: '作者编号'
  },
  author: {
    type: DataTypes.STRING,
    comment: '文章作者'
  },
  is_top: {
    type: DataTypes.BOOLEAN,
    comment: '是否置顶'
  },
  read_count: {
    type: DataTypes.INTEGER,
    comment: '阅读数量'
  },
  description: {
    type: DataTypes.STRING,
    comment: '文章简介'
  },
  image: {
    type: DataTypes.STRING,
    comment: '文章主图'
  },
  publish_time: {
    type: DataTypes.DATE,
    comment: '发布时间'
  }
}, {
  tableName: 'xs_article',
  comment:'文章表'
})

// Article.hasOne(ArticleCategory, {
//   foreignKey: 'article',
//   sourceKey: 'id',
//   as: 'categorys'
// })

module.exports = Article