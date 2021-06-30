import Router from 'koa-router'
const router = new Router({
  prefix: '/',
})
import { access, constants, writeFile } from 'fs'
import { renderFile } from 'pug'
import { getShowData, getMainCategory } from '../../models/blog/category'
import { getReadingRank, findByPk, getByCategory } from '../../models/blog/article'

/**
 * 重定向到管理员页面
 */
router.get('admin', async (ctx, next) => {
  ctx.redirect('/admin/index.html')
})

router.get('html', async (ctx, next) => {
  ctx.redirect('/html/index.html')
})

const fileExist = (file) =>
  new Promise((resolve) => {
    access(file, constants.F_OK, async (err) => {
      // 不存在，使用模版文件，否则访问已存在的文件
      if (err) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })

function parseModel2Json(data) {
  let tmpData = data.map((v) => v.dataValues)
  tmpData.forEach(function (d, i) {
    if (d.children) {
      d.children = d.children.map((dd) => dd.dataValues)
    }
    if (d.posts) {
      d.posts = d.posts.map((dd) => dd.dataValues).slice(0, 10)
    }
  })

  return tmpData
}

/**
 * 重定向到默认页面
 */
router.get('', async (ctx, next) => {
  let hasDist = await fileExist('dist/index.html')
  // 获取数据库中的栏目
  const dataModel = await getShowData()
  const posts = parseModel2Json(await getMainCategory())
  // let posts = {}
  let data = parseModel2Json(dataModel)
  let totalRank = parseModel2Json(await getReadingRank())
  // console.log('...', posts)
  // 不存在，使用模版文件，否则访问已存在的文件
  if (!hasDist) {
    await ctx.render('template/default/index.pug', { data, posts, totalRank })
  } else {
    ctx.redirect('/html/index.html')
  }
})

/**
 * 文章页面
 */
router.get('post/:id', async (ctx, next) => {
  let hasDist = await fileExist('dist/index.html')
  // 获取数据库中的栏目
  const dataModel = await getShowData()
  // const posts = parseModel2Json(await Category.getMainCategory())
  // let posts = {}
  let data = parseModel2Json(dataModel)
  // let totalRank = parseModel2Json(await Posts.getReadingRank())
  let detail = await findByPk(ctx.params.id)
  // 不存在，使用模版文件，否则访问已存在的文件
  if (!hasDist) {
    await ctx.render('template/default/post.pug', {
      id: ctx.params.id,
      data,
      detail,
    })
  } else {
    ctx.redirect(`/html/${ctx.params.id}.html`)
  }
})

/**
 * 分类页面
 */
router.get('category/:id', async (ctx, next) => {
  const category = ctx.params.id
  let hasDist = await fileExist(`dist/category/${category}/index.html`)

  const posts = parseModel2Json(await getByCategory(category))
  // let posts = {}
  // 不存在，使用模版文件，否则访问已存在的文件
  if (!hasDist) {
    await ctx.render('template/default/category.pug', {
      id: ctx.params.id,
      posts,
    })
  } else {
    ctx.redirect(`/html/${ctx.params.id}.html`)
  }
})

/**
 * 频道页面
 */
router.get('/channel/:id', async (ctx, next) => {
  const category = ctx.params.category
  let hasDist = await fileExist(`dist/${category}/index.html`)
  // 不存在，使用模版文件，否则访问已存在的文件
  if (!hasDist) {
    await ctx.render('template/default/category.pug', { id: ctx.params.id })
  } else {
    ctx.redirect(`/html/${ctx.params.id}.html`)
  }
})

/**
 * 单独页面
 */
router.get('/pages/:id', async (ctx, next) => {
  const category = ctx.params.category
  let hasDist = await fileExist(`dist/${category}/index.html`)
  // 不存在，使用模版文件，否则访问已存在的文件
  if (!hasDist) {
    await ctx.render('template/default/category.pug', { id: ctx.params.id })
  } else {
    ctx.redirect(`/html/${ctx.params.id}.html`)
  }
})

router.get('sys/build', async (ctx, next) => {
  const html = renderFile('template/default/index.pug', {})
  writeFile('dist/index.html', html, (err) => {
    if (err) {
      console.log('writeFile Error', err)
    }
    console.log('writeFile Success!')
  })
})

export default router
