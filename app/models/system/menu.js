const {
  DataTypes,
  sequelize,
  BaseModel
} = require('../baseModel')

class Menu extends BaseModel {

  static async getTreeData() {
    let where = {
      status: 0,
      pid: null
    }
    const result = await Menu.findAll({
      where,
      order: [
        ['order'],
        ['create_time', 'desc']
      ],
      attributes:[['id','key'],['name','title']],
      include: [{
          model: Menu,
          as: 'children',
          attributes:[['id','key'],['name','title']],
        },
      ]
    })

    return result
  }


  static async getAll(type) {
    let where = {
      status: 0
    }
    if (type == 1) {
      where.pid = null
    }
    const result = await Menu.findAll({
      where,
      order: [
        ['order'],
        ['create_time', 'desc']
      ],
      include: [{
        model: Menu,
        as: 'children'
      }]
    })

    return result
  }
}



Menu.initModel({
  pid: {
    type: DataTypes.INTEGER,
    comment: '上级菜单'
  },
  type: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: '菜单类型，1:路由，2:权限'
  },
  plateform: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: '菜单适用平台，1:后端管理， 2:前台网站， 3: 移动端'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '菜单名称'
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '菜单图标'
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '菜单地址'
  },
  code: {
    type: DataTypes.STRING,
    comment: '菜单编码'
  },
  order: {
    type: DataTypes.INTEGER,
    comment: '菜单顺序'
  },
  desc: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '说明'
  }
}, {
  comment: '系统菜单表',
  tableName: 'xs_sys_menu'
})

Menu.hasMany(Menu, {
  foreignKey: 'pid',
  targetKey: 'id',
  as: 'children'
})

module.exports = {
  Menu
}