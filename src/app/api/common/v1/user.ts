
// import { create } from '../../../models/user'
import validator from '../../../validators/validator'
import User from '../../../entity/user'
import { getManager } from 'typeorm'
import swaggerApi from '../../../decorators/swaggerApi'
import { userModel } from '../../../decorators'
const manger = getManager()

export default class UserApi {

  /**
   * 用户注册
   * @param ctx 
   * @param next 
   */
  @swaggerApi({ module: 'user', url: 'register', desc: '用户注册', method: 'post' })
  static async register(ctx, next) {
    const v: userModel = await new validator.WecRegisterValidator().validate(ctx)
    const user = {
      email: v.email,
      password: v.password1,
      nickname: v.nickname,
      username: v.username,
    }

    await manger.create(User, user)
    throw new global.errs.Success()
  }
}
