const Router = require('koa-router')
const router = new Router({
	prefix: '/api/blog/v1/article'
})

const {
	PaginationValidator,
	PositiveIntegerValidator,
	WecValidator
} = require('../../../validators/validator')

const Article = require('../../../models/blog/article')

router.get('/pagination', async (ctx, next) => {
	const params = await new PaginationValidator().validate(ctx)
	const result = await Article.getPaginationArticle(params)
	ctx.body = {
		data: result
	}
})

router.get('/list', async (ctx, next) => {
	const params = await new WecValidator().validate(ctx)
	const result = await Article.getArticleList(params)
	ctx.body = {
		data: result
	}
})

router.get('/latest', async (ctx, next) => {
	const result = await Article.getLatestArticleList()
	ctx.body = result.data

})

router.get('/hot', async (ctx, next) => {
	const result = await Article.getHotArticleList()
	ctx.body = result.data

})

router.get('/relevant', async (ctx, next) => {
	const params = await new WecValidator().validate(ctx)
	const result = await Article.getRelevantArticleList(params)
	ctx.body = result.data ||[]

})

router.get('/:id', async (ctx, next) => {
	const result = await Article.findOne({
		where: {
			id: ctx.params.id
		}
	})

	if(result){

		// 更新阅读量
		await Article.update({
			read_count: result.read_count + 1
		}, {
			where: {
				id: ctx.params.id
			}
		})
		ctx.body = result
	}else {
		ctx.body = '??'
	}
})

router.post('/', async (ctx, next) => {
	const data = await new WecValidator().validate(ctx)
	const result = await Article.saveArticle(data)
	ctx.body = result
})

router.post('/publish', async (ctx, next) => {
	const data = await new WecValidator().validate(ctx)
	const result = await Article.publishArticle(data)
	ctx.body = result
})

router.del('/', async (ctx, next) => {
	const params = await new PositiveIntegerValidator().validate(ctx)
	const result = await Article.destroy({
		where: {
			id: params.id
		}
	})

	ctx.body = result
})

module.exports = router