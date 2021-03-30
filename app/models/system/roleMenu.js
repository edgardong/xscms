const {
  DataTypes,
  BaseModel
} = require('../baseModel')

class RoleMenu extends BaseModel {
  static async saveByRole(data) {
    // data: {roleId:'',menu:['','','']}

    await RoleMenu.destroy({
      where: {
        role: data.roleId
      }
    })

    let records = data.menu.map(m => ({
      role: data.roleId,
      menu: m
    })).concat(data.halfMenu.map(hm => ({
      role: data.roleId,
      half_menu: hm
    })))

    return await RoleMenu.bulkCreate(records)

  }
}

RoleMenu.initModel({
  name: {
    type: DataTypes.STRING,
    comment: '名称',
    allowNull: true
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '角色id'
  },
  menu: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '菜单id'
  },
  half_menu: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '父级菜单id'
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '状态，0可用，1禁用'
  },
  code: {
    type: DataTypes.STRING,
    comment: '菜单编码'
  },
  order: {
    type: DataTypes.INTEGER,
    comment: '顺序'
  }
}, {
  tableName: 'xs_sys_role_menu'
})

module.exports = {
  RoleMenu
}