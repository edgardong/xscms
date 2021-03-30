const Router = require('koa-router')
const router = new Router({
  prefix: '/api/store/v1/category'
})

const {
  Category
} = require('../../../models/category')

const {
  PaginationValidator,
  CategroyValidator,
  PositiveIntegerValidator
} = require('../../../validators/validator')

/**
 * 获取所有分类
 */
router.get('/all', async (ctx, next) => {
  const categorys = await Category.getAll();
  Category.prototype.exclude = ['update_time', 'delete_time', 'create_time']
  ctx.body = categorys
})

/**
 * 根据分页获取分类
 */
router.get('/pagination', async (ctx, next) => {
  const params = await new PaginationValidator().validate(ctx)
  const categorys = await Category.getPagination(params)
  ctx.body = {
    errCode: 0,
    data: categorys,
    errMsg: '操作成功'
  }
})

/**
 * 添加新的分类
 */
router.post('/', async (ctx, next) => {
  const data = await new CategroyValidator().validate(ctx)
  const result = await Category.create(data)
  ctx.body = {
    errCode: 0,
    data: result,
    errMsg: '操作成功'
  }
})

/**
 * 更新分类
 */
router.put('/', async (ctx, next) => {
  const data = await new CategroyValidator().validate(ctx)
  const result = await Category.update(data, {
    where: {
      id: data.id
    }
  })
  ctx.body = {
    errCode: 0,
    data: result,
    errMsg: '操作成功'
  }
})

/**
 * 删除一条数据
 */
router.delete('/', async (ctx, next) => {
  const data = await new PositiveIntegerValidator().validate(ctx)
  const result = await Category.destroy({
    where: {
      id: data.id
    }
  })
  ctx.body = {
    errCode: 0,
    data: result,
    errMsg: '操作成功'
  }
})

module.exports = router