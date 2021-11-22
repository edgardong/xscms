import swaggerApi from '../../../decorators/swaggerApi'
import validator from '../../../validators/validator'
import { LoginType } from '../../../lib/enum'
import UserModel from '../../../models/user'
import util from '../../../../core/util'
import Auth from '../../../../middlewares/auth'
import wxManager from '../../../services/wx'
import ThirdAppModel from '../../../models/thirdApp'

const userSchema = {
  username: { type: 'string', required: true, description: '用户名', example: 'edgarhao' },
  password: { type: 'string', required: true, description: '密码' }
}

export default class Token {

  /**
   * 第三方应用授权登录
   * @param ctx 
   * @param next 
   */
  @swaggerApi({ module: 'token', method: 'post', url: 'app', desc: '第三方用户授权登录', body: userSchema })
  static async appAuth(ctx, next) {
    const params = await new validator.ACLoginValidator().validate(ctx)
    const result = await ThirdAppModel.getAppToken(params)
    ctx.body = {
      token: result,
    }
  }

  /**
   * 用户名密码登录
   */
  @swaggerApi({ module: 'token', method: 'post', url: 'login', desc: '用户登录', body: userSchema })
  static async login(ctx, next) {
    const params = await new validator.TokenValidatar().validate(ctx, {
      account: 'username',
      secret: 'password',
    })
    const result = await UserModel.userLogin(params)
    ctx.body = {
      token: result,
    }
  }

  /**
   * 创建用户
   * @param ctx 
   * @param next 
   */
  @swaggerApi({ module: 'token', method: 'post', url: 'user', desc: '创建用户', body: userSchema })
  static async postUser(ctx, next) {
    const v = await new validator.TokenValidatar().validate(ctx)
    const type = parseInt((v as any).type)
    let token = ''
    switch (type) {
      case LoginType.USER_EMAIL:
        token = await emailLogin((v as any).account, (v as any).secret)
        break
      case LoginType.USER_MINI_PROGRAM:
        token = await wxManager.codeToToken((v as any).account)
        break
      default:
        throw new (global.errs as any).NotFound('没有对应的处理方式')
    }
    ctx.body = {
      token,
    }
  }

  /**
   * 校验token
   * @param ctx 
   * @param next 
   */
   @swaggerApi({ module: 'token', method: 'post', url: 'verify', desc: '校验token', body: userSchema })
  static async verify(ctx, next) {
    const v = await new validator.NotEmptyValidator().validate(ctx)
    const result = Auth.verifyToken((v as any).token)
    ctx.body = {
      result,
    }
  }

}


/**
 * Email用户登录
 * @param {*} account 用户名
 * @param {*} secret 密码
 */
async function emailLogin(account, secret) {
  const user = await UserModel.verifyEmailPassword(account, secret)
  return util.generateToken(user.id, Auth.USER)
}