const Router = require('koa-router')
const router = new Router({
  prefix: '/',
})
const fs = require('fs')
const pug = require('pug')
const Category = require('../../models/blog/category')

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
    fs.access(file, fs.constants.F_OK, async (err) => {
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
  })

  return tmpData
}

/**
 * 重定向到默认页面
 */
router.get('', async (ctx, next) => {
  let hasDist = await fileExist('dist/index.html')
  // 获取数据库中的栏目
  const dataModel = await Category.getShowData()
  const categoryPost = await Category.getMainCategory()
  let data = parseModel2Json(dataModel)
  console.log('...', data)
  // 不存在，使用模版文件，否则访问已存在的文件
  if (!hasDist) {
    await ctx.render('template/default/index.pug', { data, categoryPost })
  } else {
    ctx.redirect('/html/index.html')
  }
})

router.get('post/:id', async (ctx, next) => {
  let hasDist = await fileExist('dist/index.html')
  // 不存在，使用模版文件，否则访问已存在的文件
  if (!hasDist) {
    await ctx.render('template/default/post.pug', { id: ctx.params.id })
  } else {
    ctx.redirect(`/html/${ctx.params.id}.html`)
  }
})

router.get('/:category', async (ctx, next) => {
  const category = ctx.params.category
  let hasDist = await fileExist(`dist/${category}/index.html`)
  // 不存在，使用模版文件，否则访问已存在的文件
  if (!hasDist) {
    await ctx.render('template/default/post.pug', { id: ctx.params.id })
  } else {
    ctx.redirect(`/html/${ctx.params.id}.html`)
  }
})

router.get('sys/build', async (ctx, next) => {
  const html = pug.renderFile('template/default/index.pug', {})
  fs.writeFile('dist/index.html', html, (err) => {
    if (err) {
      console.log('writeFile Error', err)
    }
    console.log('writeFile Success!')
  })
})

module.exports = router
