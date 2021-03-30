const {
  BaseModel,
  DataTypes
} = require('../baseModel')


class Permission extends BaseModel {}

Permission.initModel({
  type: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: '权限类型 1: 操作权限，2:数据权限'
  },
  content: {
    type: DataTypes.STRING,
    comment: '权限内容',
    set(val) {
      this.setDataValue('content', JSON.stringify(val));
    },
    // get() {
    //   const content = this.getDataValue('content');
    //   console.log('content', content)
    //   return JSON.parse(content)
    // }
  },
  datas: {
    type: DataTypes.INTEGER,
    comment: '数据权限的值'
  },
  menu: {
    type: DataTypes.INTEGER,
    comment: '菜单id'
  },
  role: {
    type: DataTypes.INTEGER,
    comment: '角色id'
  }
}, {
  tableName: 'xs_sys_permission',
  comment: '系统权限表'
})

module.exports = {
  Permission
}