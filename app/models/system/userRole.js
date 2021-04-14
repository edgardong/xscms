const {
  DataTypes,
  BaseModel
} = require('../baseModel')

class UserRole extends BaseModel {}

UserRole.initModel({
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '用户id'
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '角色id'
  },
}, {
  comment: '用户角色表',
  tableName: 'xs_sys_user_role'
})

module.exports =  UserRole