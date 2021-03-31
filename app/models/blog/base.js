const {
  sequelize,
  DataTypes,
  BaseModel
} = require('../baseModel')

class BlogBase extends BaseModel {

}

BlogBase.initModel({
  url: {
    type: DataTypes.STRING,
    comment: '网站地址'
  },
  logo: {
    type: DataTypes.STRING,
    comment: 'logo地址'
  },
  split: {
    type: DataTypes.STRING,
    comment: '分隔符',
    defaultValue:'-'
  },
  title: {
    type: DataTypes.STRING,
    comment: '网站标题'
  },
  keywords: {
    type: DataTypes.STRING,
    comment: '关键字'
  },
  description: {
    type: DataTypes.STRING,
    comment: '网站描述'
  },
  icp: {
    type: DataTypes.STRING,
    comment: '备案信息'
  },
  footer: {
    type: DataTypes.TEXT,
    comment: '底部文字'
  },
  ico: {
    type: DataTypes.STRING,
    comment: 'ico图标地址'
  },
  status: {
    type: DataTypes.INTEGER,
    comment: '状态',
    defaultValue: 0
  },
  baidu_tongji: {
    type: DataTypes.STRING,
    comment: '百度统计的key'
  },
  bing_push: {
    type: DataTypes.STRING,
    comment: 'Bing推送的key'
  },
}, {
  tableName: 'xs_site',
  sequelize,
  comment:'博客基本信息'
})


module.exports = BlogBase