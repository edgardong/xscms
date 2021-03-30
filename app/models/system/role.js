const {
  DataTypes,
  BaseModel
} = require('../baseModel')

const {
  Permission
} = require('./permission')

const {
  Menu
} = require('./menu')

const {
  Entitys
} = require('./base')

const PermissionTypes = require('./permissionTypes')

class Role extends BaseModel {
  /**
   * 获取操作权限数据
   */
  static async getOperatePermission(role) {
    if (role === undefined) {
      return []
    }
    let data = await Permission.findAll({
      where: {
        type: 1,
        status: 0,
        role
      }
    })

    // 初始化数据
    if (!data || data.length <= 0) {
      const menus = await Menu.findAll({
        where: {
          status: 0,
          type: 1
        }
      })
      const Operate = Entitys.operate.entity
      // console.log(Operate)
      const ops = await Operate.findAll({
        where: {
          status: 0
        },
        attributes: ['id', 'name', 'code', 'comment']
      })

      let content = {}
      ops.forEach(op => {
        content[op.code] = false
      })

      data = menus.map(ro => ({
        type: 1,
        menu: ro.id,
        name: ro.name,
        code: ro.code,
        role,
        content
      }))

    } else {
      let datas = data.map(d => ({
        ...d.dataValues,
        content: JSON.parse(d.content)
      }))

      return datas
    }

    // console.log(data)
    return data
  }

  static async saveOperatePermission(data) {
    let records = data

    const pers = await Permission.findAll({
      where: {
        status: 0,
        type: 1,
        role: data[0].role
      }
    })

    if (pers.length <= 0) {
      Permission.bulkCreate(records)
    } else {
      records = records.filter(r => r.changed)
      records.forEach(re => {
        Permission.update(re, {
          where: {
            role: re.role,
            menu: re.menu,
            type: 1
          }
        })
      })
    }

    return {
      msg: '保存成功'
    }

  }

  static async getDataPermissionTypes() {
    return PermissionTypes
  }

  static async getDataPermission(role) {
    if (role === undefined) {
      return []
    }
    let data = await Permission.findAll({
      where: {
        type: 2,
        status: 0,
        role
      }
    })

    // 初始化数据
    if (!data || data.length <= 0) {
      const menus = await Menu.findAll({
        where: {
          status: 0,
          type: 1
        }
      })
      data = menus.map(ro => ({
        type: 2,
        menu: ro.id,
        name: ro.name,
        code: ro.code,
        datas: '',
        role
      }))
    }

    return data
  }

  static async saveDataPermission(data) {
    let records = data

    const pers = await Permission.findAll({
      where: {
        status: 0,
        type: 2,
        role: data[0].role
      }
    })

    if (pers.length <= 0) {
      Permission.bulkCreate(records)
    } else {
      // records = records.filter(r => r.changed)
      records.forEach(re => {
        Permission.update(re, {
          where: {
            role: re.role,
            menu: re.menu,
            type: 2
          }
        })
      })
    }

    return {
      msg: '保存成功'
    }

  }

}

Role.initModel({
  type: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: '菜单类型，1:路由，2:权限'
  }
}, {
  tableName: 'xs_sys_role'
})

module.exports = {
  Role
}