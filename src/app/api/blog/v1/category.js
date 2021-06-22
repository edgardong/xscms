const Router = require('koa-router')
const router = new Router({
  prefix: '/api/blog/v1/category'
})

const Category = require('../../../models/blog/category')
const Tag = require('../../../models/blog/tags')

const {
  PaginationValidator,
  PositiveIntegerValidator,
  WecValidator
} = require('../../../validators/validator')

/**
 * 获取博客分类
 */
router.get('/', async (ctx, next) => {
  Category.prototype.exclude = ['create_time', 'parent', 'status']
  const result = await Category.getAllCategory()
  ctx.body = result
})

router.get('/tree', async (ctx, next) => {
  const data = await Category.getTreeData()
  ctx.body = {
    data
  }
})

router.get('/pagination', async (ctx, next) => {
  const params = await new PaginationValidator().validate(ctx)
  params.order = ['order']
  const result = await Category.getPagination(params, {
    parent: null
  }, {
    include: [{
      model: Category,
      as: 'children'
    }]
  })
  ctx.body = {
    data: result
  }
})

/**
 * 获取博客分类
 */
router.get('/all', async (ctx, next) => {
  Category.prototype.exclude = []
  const data = await Category.getAllCategory()
  ctx.body = {
    data
  }
})

router.get('/hottag', async (ctx, next)=> {
  const data = await Tag.getAllTag()
  ctx.body = {
    data
  }
})

/**
 * 添加文章分类
 */
router.post('/', async (ctx, next) => {
  const data = {
    status: 0,
    ...ctx.request.body
  }
  const result = await Category.create(data)
  ctx.body = {
    msg: '操作成功'
  }
})

/**
 * 更新博客分类
 */
router.put('/', async (ctx, next) => {
  const data = {
    status: 0,
    ...ctx.request.body
  }
  const result = await Category.update(data, {
    where: {
      id: ctx.request.body.id
    }
  })
  ctx.body = {
    msg: '更新成功'
  }
})

/**
 * 删除博客分类
 */
router.delete('/', async (ctx, next) => {
  const result = await Category.destroy({
    where: {
      id: ctx.request.body.id
    }
  })
  ctx.body = {
    msg: '删除成功'
  }
})

module.exports = router