import basicAuth from 'basic-auth'
import { verify } from 'jsonwebtoken'

class Auth {

  constructor(level) {
    this.level = level || 1
    Auth.USER = 8
    Auth.ADMIN = 16
    Auth.SUPER_ADMIN = 32
  }

  get m() {
    return async (ctx, next) => {
      // 检查用户的token
      const userToken = basicAuth(ctx.req)
      // console.log(userToken)
      if (!userToken || !userToken.name) {
        throw new global.errs.Forbidden()
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
      if (decode.scope < this.level) {
        throw new global.errs.Forbidden('权限不足')
      }

      ctx.auth = {
        uid: decode.uid,
        scope: decode.scope
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

export default {
  Auth
}