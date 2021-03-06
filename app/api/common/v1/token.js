const Router = require('koa-router')
const router = new Router({
  prefix: '/api/common/v1/token',
})

const {
  TokenValidatar,
  NotEmptyValidator,
  ACLoginValidator,
} = require('../../../validators/validator')
const { LoginType } = require('../../../lib/enum')
const User = require('../../../models/user')
const { generateToken } = require('../../../../core/util')
const { Auth } = require('../../../../middlewares/auth')
const WXManager = require('../../../services/wx')

const ThirdApp = require('../../../models/thirdApp')

/**
 * 第三方应用授权登录
 */
router.post('/app', async (ctx, next) => {
  const params = await new ACLoginValidator().validate(ctx)
  const result = await ThirdApp.getAppToken(params)
  ctx.body = {
    token: result,
  }
})

/**
 * 用户名密码登录
 */
router.post('/login', async (ctx, next) => {
  const params = await new TokenValidatar().validate(ctx, {
    account: 'username',
    secret: 'password',
  })
  const result = await User.userLogin(params)
  ctx.body = {
    token: result,
  }
})

router.post('/user', async (ctx, next) => {
  const v = await new TokenValidatar().validate(ctx)
  const type = parseInt(v.type)
  let token = ''
  switch (type) {
    case LoginType.USER_EMAIL:
      token = await emailLogin(v.account, v.secret)
      break
    case LoginType.USER_MINI_PROGRAM:
      token = await WXManager.codeToToken(v.account)
      break
    default:
      throw new global.errs.NotFound('没有对应的处理方式')
  }
  ctx.body = {
    token,
  }
})

/**
 * 校验token
 */
router.post('/verify', async (ctx, next) => {
  const v = await new NotEmptyValidator().validate(ctx)
  console.log('我来教研token了', v)
  const result = Auth.verifyToken(v.token)
  ctx.body = {
    result,
  }
})

/**
 * Email用户登录
 * @param {*} account 用户名
 * @param {*} secret 密码
 */
async function emailLogin(account, secret) {
  const user = await User.verifyEmailPassword(account, secret)
  return generateToken(user.id, Auth.USER)
}

module.exports = router
