import * as basicAuth from 'basic-auth'
import { verify } from 'jsonwebtoken'

class Auth {
  level: number
  static USER: number
  static ADMIN: number
  static SUPER_ADMIN: number

  constructor(level = 1) {
    this.level = level
    Auth.USER = 8
    Auth.ADMIN = 16
    Auth.SUPER_ADMIN = 32
  }

  get m() {
    return async (ctx, next) => {
      // console.log(userToken)
      // 检查用户的token
      const userToken = basicAuth(ctx.req)
      console.log('....',userToken)
      if (!userToken || !userToken.name) {
        throw new global.errs.Forbidden('')
      }
      let decode = {}
      try {
        decode = verify(userToken.name, global.config.security.secretKey)
        // decode = jwt.verify(`${userToken.name}:${userToken.pass}`, global.config.security.secretKey)
      } catch (error) {
        if (error.name == 'TokenExpiredError') {
          throw new global.errs.Forbidden('token已过期')
        } else {
          throw new global.errs.Forbidden('token无效')
        }
      }

      // 校验权限等级
      if ((decode as any).scope < this.level) {
        throw new global.errs.Forbidden('权限不足')
      }

      ctx.auth = {
        uid: (decode as any).uid,
        scope: (decode as any).scope
      }

      await next()
    }
  }

  static verifyToken(token) {
    try {
      verify(token, global.config.security.secretKey)
    } catch (error) {
      return false
    }
    return true
  }
}

export default Auth