import * as bcrypt from 'bcryptjs'
import { getManager } from "typeorm"
import User from '../entity/user'

const manager = getManager()

import util from '../../core/util'
import Auth from '../../middlewares/auth'
import UserRole from '../entity/userRole'

class UserModel {
  /**
   * 校验用户名密码是否正确
   * @param {*} email 用户名
   * @param {*} plainPassword 密码
   */
  static async verifyEmailPassword(email: string, plainPassword: string) {
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
  static async getUserByOpenId(openid: string) {
    return await manager.findOne(User, {
      where: {
        openid,
      },
    })
  }

  static async registerUserByOpenId(openid: string) {
    return await manager.create(User, {
      openid,
    })
  }

  /**
   * 删除用户（软删除）
   * @param {*} id
   */
  static async deleteUserById(id: string) {

    // let result = await manager.update(User,{status:2});
    // let result = await getConnection()
    //   .createQueryBuilder()
    //   .update(User)
    //   .set({ status: 2 })
    //   .where("id=:id", { id })
    //   .execute()
    let result = await User.update({ status: 2 }, { id })
    if (result) {
      return '删除成功'
    }
    return '删除失败'
  }

  /**
   * 更新用户信息
   * @param {*} user 用户信息
   */
  static async updateUserRole(user: any, roles?: any) {
    // console.log('....用户', user)
    // await UserRole.destroy({
    //   where: {
    //     user_id: user.id,
    //     status: 0,
    //   },
    // })

    await manager.delete(UserRole,{
      where:{
        user_id: user.id,
        status: 0,
      }
    })

    let records = user.roles.map((ur) => ({
      user_id: user.id,
      role_id: ur.key,
      name: `${user.username}-${ur.label}`,
    }))
    // UserRole.bulkCreate(records)
    manager.save(records);
  }

  /**
   * 添加一个用户
   * @param {object} user 用户对象
   */
  static async addUser(user: any, roles?: any) {
    const data = JSON.parse(JSON.stringify(user))
    user.roles = JSON.stringify(user.roles)
    let uid: { id: string } = await manager.create({
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
  static async updateUser(user: any) {
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
  static async getPaginationUser(params: any) {
    let result: { data: any[], total: number, per_page: number, current_page: number, last_page: number } = {
      data: [],
      total: 0,
      per_page: params.size,
      current_page: params.page,
      last_page: 0,
    }

    const users = await manager.findAndCount(User, {
      take: params.size,
      skip: (params.page - 1) * params.size,
      // order: {create_time: 'DESC'},
      where: {
        status: 0,
      },
    })

    result.data = users
    //.rows
    //result.total = users.count
    //result.last_page = getLastPage(result.total, result.per_page)

    return result
  }

  /**
   * 用户密码登录
   * @param {*} params
   */
  static async userLogin(params: any) {
    const user = await manager.findOne(User, {
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
    return util.generateToken(user.id, Auth.USER)
  }
}

export default UserModel
