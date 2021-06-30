import Router from 'koa-router'
const router = new Router({
	prefix: '/api/blog/v1/article'
})

import {
	PaginationValidator, PositiveIntegerValidator, WecValidator
} from '../../../validators/validator'

import { getPaginationArticle, getArticleList, getLatestArticleList, getHotArticleList, getRelevantArticleList, findOne, update, saveArticle, publishArticle, destroy } from '../../../models/blog/article'

router.get('/pagination', async (ctx, next) => {
	const params = await new PaginationValidator().validate(ctx)
	const result = await getPaginationArticle(params)
	ctx.body = {
		data: result
	}
})

router.get('/list', async (ctx, next) => {
	const params = await new WecValidator().validate(ctx)
	const result = await getArticleList(params)
	ctx.body = {
		data: result
	}
})

router.get('/latest', async (ctx, next) => {
	const result = await getLatestArticleList()
	ctx.body = result.data

})

router.get('/hot', async (ctx, next) => {
	const result = await getHotArticleList()
	ctx.body = result.data

})

router.get('/relevant', async (ctx, next) => {
	const params = await new WecValidator().validate(ctx)
	const result = await getRelevantArticleList(params)
	ctx.body = result.data || []

})

router.get('/:id', async (ctx, next) => {
	const result = await findOne({
		where: {
			id: ctx.params.id
		}
	})

	if (result) {

		// 更新阅读量
		await update({
			read_count: result.read_count + 1
		}, {
			where: {
				id: ctx.params.id
			}
		})
		ctx.body = result
	} else {
		ctx.body = '??'
	}
})

router.post('/', async (ctx, next) => {
	const data = await new WecValidator().validate(ctx)
	const result = await saveArticle(data)
	ctx.body = result
})

router.post('/publish', async (ctx, next) => {
	const data = await new WecValidator().validate(ctx)
	const result = await publishArticle(data)
	ctx.body = result
})

router.del('/', async (ctx, next) => {
	const params = await new PositiveIntegerValidator().validate(ctx)
	const result = await destroy({
		where: {
			id: params.id
		}
	})

	ctx.body = result
})

export default router