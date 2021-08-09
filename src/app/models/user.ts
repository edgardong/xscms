const bcrypt = require('bcryptjs')

import { getManager } from "typeorm"
import User from '../entity/user'

const manager = getManager()

const { generateToken } = require('../../core/util')
const { Auth } = require('../../middlewares/auth')

class UserModel {
  /**
   * 校验用户名密码是否正确
   * @param {*} email 用户名
   * @param {*} plainPassword 密码
   */
  static async verifyEmailPassword(email, plainPassword) {
    const user = await manager.findOne(User, {
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
    return await manager.findOne(User, {
      where: {
        openid,
      },
    })
  }

  static async registerUserByOpenId(openid) {
    return await manager.create(User, {
      openid,
    })
  }

  /**
   * 删除用户（软删除）
   * @param {*} id
   */
  static async deleteUserById(id) {
    let result = await manager.update(User,
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

    const users = await manager.findAndCountAll(User,{
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
    const user = await manager.findOne(User,{
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

export default UserModel
