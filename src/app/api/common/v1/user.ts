import Router from 'koa-router'
const router = new Router({
  prefix: '/api/common/v1/user',
})
import { create } from '../../../models/user'
import { WecRegisterValidator } from '../../../validators/validator'

/**
 * 用户注册
 */
router.post('/register', async (ctx, next) => {
  const v = await new WecRegisterValidator().validate(ctx)

  const user = {
    email: v.email,
    password: v.password1,
    nickname: v.nickname,
    username: v.username,
  }

  const r = await create(user)
  throw new global.errs.Success()
})

export default router
