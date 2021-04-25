const {
  Sequelize,
  BaseModel,
  DataTypes,
} = require('../baseModel')


class Btrproject extends BaseModel {

}

Btrproject.initModel(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: '主键',
    },
    name: {
      type: DataTypes.STRING,
      comment: '项目名称',
    },
    picture: {
      type: DataTypes.STRING,
      comment: '项目图片',
    },
    type: {
      type: DataTypes.INTEGER,
      comment: '项目类型 1:普通用户，2:年会员，3:终身会员',
    },
    price: {
      type: DataTypes.DOUBLE,
      comment: '项目金额',
    }
  },
  {
    tableName: 'xs_btr_project',
    comment: '巴图尔会员项目',
  }
)

module.exports = Btrproject
