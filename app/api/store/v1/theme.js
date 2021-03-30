const Router = require('koa-router')

const router = new Router({
  prefix: '/api/store/v1/theme'
})

const {
  Theme
} = require('../../../models/theme')
const {
  Image
} = require('../../../models/image')

const ThemeProduct = require('../../../models/themeProduct')

/**
 * 获取精选主题
 */
router.get('/', async (ctx, next) => {
  const ids = ctx.query.ids
  const themes = await Theme.getThemes(ids)
  Theme.prototype.exclude = ['update_time', 'delete_time', 'create_time', 'head_img_id', 'topic_img_id']
  ctx.body = themes
})

/**
 * 获取主题下的产品信息
 */
router.get('/:id', async (ctx, next) => {
  const id = ctx.params.id
  const products = await ThemeProduct.getThemeProducts(id)
  Theme.prototype.exclude = ['topic_img_id', 'head_img_id', 'create_time']
  Image.prototype.exclude = ['id', 'from', 'create_time']
  ctx.body = products
})

module.exports = router