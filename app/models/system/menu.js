const { DataTypes, Op, sequelize, BaseModel } = require('../baseModel')

const User = require('../user')
const RoleMenu = require('./roleMenu')

class Menu extends BaseModel {
  static async getTreeData() {
    let where = {
      status: 0,
      pid: null,
    }
    const result = await Menu.findAll({
      where,
      order: [['order'], ['create_time', 'desc']],
      attributes: [
        ['id', 'key'],
        ['name', 'title'],
      ],
      include: [
        {
          model: Menu,
          as: 'children',
          attributes: [
            ['id', 'key'],
            ['name', 'title'],
          ],
        },
      ],
    })

    return result
  }

  static async getMenuByRole() {}

  /**
   * 根据权限获取用户菜单
   * @param {*} params
   * @param {*} auth 认证信息
   * @returns
   */
  static async getAll(params, auth) {
    let type = params.type
    let { uid, socpe } = auth
    let user = await User.findOne({
      where: {
        status: 0,
        id: uid,
      },
    })
    // id: {
    //   [opIn]: artIds,
    // },
    let where = {}
    if (user.usertype != 99) {
      let roles = JSON.parse(user.roles).map((r) => r.key)
      let menuIds = await RoleMenu.findAll({
        where: {
          role: {
            [Op.in]: roles,
          },
        },
      })

      where = {
        status: 0,
        id: {
          [Op.in]: menuIds.map((m) => m.menu),
        },
      }
    } else {
      where = {
        status: 0,
      }
    }

    if (type == 1) {
      where.pid = null
    }
    const result = await Menu.findAll({
      where,
      order: [['order'], ['create_time', 'desc']],
      include: [
        {
          model: Menu,
          as: 'children',
        },
      ],
    })

    return result
  }
}

Menu.initModel(
  {
    pid: {
      type: DataTypes.INTEGER,
      comment: '上级菜单',
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '菜单类型，1:路由，2:权限',
    },
    plateform: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '菜单适用平台，1:后端管理， 2:前台网站， 3: 移动端',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '菜单名称',
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: '菜单图标',
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '菜单地址',
    },
    code: {
      type: DataTypes.STRING,
      comment: '菜单编码',
    },
    order: {
      type: DataTypes.INTEGER,
      comment: '菜单顺序',
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: '说明',
    },
  },
  {
    comment: '系统菜单表',
    tableName: 'xs_sys_menu',
  }
)

Menu.hasMany(Menu, {
  foreignKey: 'pid',
  targetKey: 'id',
  as: 'children',
})

module.exports = Menu
