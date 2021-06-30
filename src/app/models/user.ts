const bcrypt = require('bcryptjs')

const {
  Sequelize,
  sequelize,
  DataTypes,
  Model,
  getLastPage,
} = require('./baseModel')

const { generateToken } = require('../../core/util')
const { Auth } = require('../../middlewares/auth')

const UserRole = require('./system/userRole')

class User extends Model {
  /**
   * 校验用户名密码是否正确
   * @param {*} email 用户名
   * @param {*} plainPassword 密码
   */
  static async verifyEmailPassword(email, plainPassword) {
    const user = await User.findOne({
      where: {
        email,
      },
    })
    if (!user) {
      throw new global.errs.AuthFailed('账号或密码错误')
    } else {
      const correct = bcrypt.compareSync(plainPassword, user.password)
      if (!correct) {
        throw new global.errs.AuthFailed('账号或密码错误')
      }
    }

    return user
  }

  /**
   * 根据openid获取用户
   * @param {*} openid
   */
  static async getUserByOpenId(openid) {
    return await User.findOne({
      where: {
        openid,
      },
    })
  }

  static async registerUserByOpenId(openid) {
    return await User.create({
      openid,
    })
  }

  /**
   * 删除用户（软删除）
   * @param {*} id
   */
  static async deleteUserById(id) {
    let result = await User.update(
      {
        status: 1,
      },
      {
        where: {
          id,
        },
      }
    )
    if (result) {
      return '删除成功'
    }
    return '删除失败'
  }

  /**
   * 更新用户信息
   * @param {*} user 用户信息
   */
  static async updateUserRole(user) {
    // console.log('....用户', user)
    await UserRole.destroy({
      where: {
        user_id: user.id,
        status: 0,
      },
    })

    let records = user.roles.map((ur) => ({
      user_id: user.id,
      role_id: ur.key,
      name: `${user.username}-${ur.label}`,
    }))
    UserRole.bulkCreate(records)
  }

  /**
   * 添加一个用户
   * @param {object} user 用户对象
   */
  static async addUser(user) {
    const data = JSON.parse(JSON.stringify(user))
    user.roles = JSON.stringify(user.roles)
    let uid = await User.create({
      ...user,
    })
    this.updateUserRole({
      ...data,
      id: uid.id,
    })
    return uid
  }

  /**
   * 更新用户信息
   * @param {*} user
   */
  static async updateUser(user) {
    await this.updateUserRole(user.id, user.roles)
    user.roles = JSON.stringify(user.roles)
    return await User.update(user, {
      where: {
        status: 0,
        id: user.id,
      },
    })
  }

  /**
   * 分页获取用户
   * @param {*} params
   */
  static async getPaginationUser(params) {
    let result = {
      data: [],
      total: 0,
      per_page: params.size,
      current_page: params.page,
      last_page: 0,
    }

    const users = await User.findAndCountAll({
      limit: params.size,
      offset: (params.page - 1) * params.size,
      order: [['create_time', 'desc']],
      where: {
        status: 0,
      },
    })

    result.data = users.rows
    result.total = users.count
    result.last_page = getLastPage(result.total, result.per_page)

    return result
  }

  /**
   * 用户密码登录
   * @param {*} params
   */
  static async userLogin(params) {
    const user = await User.findOne({
      where: {
        username: params.username,
      },
    })

    if (!user) {
      throw new global.errs.AuthFailed('账号或密码错误')
    } else {
      const correct = bcrypt.compareSync(params.password, user.password)
      if (!correct) {
        throw new global.errs.AuthFailed('账号或密码错误')
      }
    }
    return generateToken(user.id, Auth.USER)
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    roles: {
      type: DataTypes.STRING,
      comment: '用户角色id集',
    },
    role_names: {
      type: DataTypes.STRING,
      comment: '用户角色名称集',
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '用户状态，0可用，1禁用',
    },
    avatar: {
      type: DataTypes.STRING,
      comment: '用户头像',
    },
    wechat: {
      type: DataTypes.STRING,
      comment: '用户微信号',
    },
    qq: {
      type: DataTypes.STRING,
      comment: '用户QQ号',
    },
    mobile: {
      type: DataTypes.STRING(11),
      comment: '用户手机号',
    },
    last_login_time: {
      type: DataTypes.DATE,
      comment: '上次登录时间',
    },
    last_login_ip: {
      type: DataTypes.STRING,
      comment: '上次登录ip',
    },
    usertype: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      comment: '用户类型 999:admin, 1:小程序用户 , 2:app 用户 3:web用户',
    },
    email: {
      type: DataTypes.STRING(128),
      comment: '用户邮箱地址',
    },
    password: {
      type: DataTypes.STRING,
      set(val) {
        const sault = bcrypt.genSaltSync(10)
        const psw = bcrypt.hashSync(val, sault)
        this.setDataValue('password', psw)
      },
    },
    openid: {
      type: DataTypes.STRING(64),
      comment: '用户的openid',
    },
  },
  {
    sequelize,
    tableName: 'xs_user',
    comment: '系统用户表',
  }
)

export default User
