const {
  Sequelize,
  DataTypes,
  sequelize,
  BaseModel
} = require('./baseModel')

class Area extends BaseModel {

  /**
   * 获取所有系统中的所有区域数据
   */
  static async getAll() {
    const areas = await Area.findAll({
      where: {
        level: 1
      },
      include: [{
        model: Area,
        as: 'subList',
        through: {
          attributes: []
        },
        include: [{
          model: Area,
          as: 'subList',
          through: {
            attributes: []
          }
        }]
      }]
    })
    return areas;
  }

  /**
   * 获取下属区域
   * @param {Integer} parent_id 父级区域id
   */
  static async getChildAreas(parent_id) {
    const areas = await Area.findAll({
      where: {
        parent_id
      }
    })

    return areas
  }

}

Area.initModel({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  area_code: {
    type: DataTypes.STRING,
    comment: '地区编码'
  },
  area_name: {
    type: DataTypes.STRING,
    comment: '地区名称'
  },
  level: {
    type: DataTypes.TINYINT,
    comment: '地区级别（1:省份province,2:市city,3:区县district,4:街道street）'
  },
  city_code: {
    type: DataTypes.STRING,
    comment: '城市编码'
  },
  center: {
    type: DataTypes.STRING,
    comment: '城市中心点（即：经纬度坐标）'
  },
  parent_id: {
    type: DataTypes.INTEGER,
    comment: '地区父节点'
  }
}, {
  tableName: 'xs_area',
  comment:'省市区域表'
})

Area.belongsToMany(Area, {
  through: 'xs_area',
  foreignKey: 'parent_id',
  otherKey: 'id',
  as: 'subList'
})

module.exports = Area