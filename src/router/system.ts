/*
 * @Author: yishusheng
 * @Date: 2021-03-30 16:16:31
 * @version: 1.0.0
 * @LastEditTime: 2021-07-07 18:13:08
 * @LastEditors: yishusheng
 * @Description: 系统路由文件
 */

import KoaRouter from '../app/api/Router'
import utils from '../core/util'

const router = new KoaRouter({
  prefix: '/',
})
import { renderFile } from 'pug'
// import server from '../../admin/server/index.jsx'
// import {content} from '../../admin/server/app'
// import { getShowData, getMainCategory } from '../../models/blog/category'
// import { getReadingRank, findByPk, getByCategory } from '../../models/blog/article'

/**
 * 重定向到管理员页面
 */
// router.get('admin', async (ctx, next) => {
//   // let hasDist = await utils.fileExist('public/admin/index.html')
//   // // 不存在，使用模版文件，否则访问已存在的文件
//   // if (!hasDist) {
//   //   await (ctx as any).render('src/template/admin/index.pug', {})
//   // } else {
//   //   ctx.redirect('admin/index.html')
//     // ctx.redirect('http://localhost:9333')
//   // }
//   // ctx.body= '正在访问'
// })



/**
 * 格式化代码
 * @param data
 * @returns
 */
function parseModel2Json(data: any[]) {
  let tmpData = data.map((v) => v.dataValues)
  tmpData.forEach(function (d, i) {
    if (d.children) {
      d.children = d.children.map((dd: { dataValues: any }) => dd.dataValues)
    }
    if (d.posts) {
      d.posts = d.posts.map((dd: { dataValues: any }) => dd.dataValues).slice(0, 10)
    }
  })

  return tmpData
}

/**
 * 重定向到默认页面
 */
router.get('', async (ctx, next) => {
  let hasDist = await utils.fileExist('public/html/index.html')
  // 获取数据库中的栏目
  const dataModel = []
  const posts = []
  // let posts = {}
  let data = parseModel2Json(dataModel)
  let totalRank = []
  // 不存在，使用模版文件，否则访问已存在的文件
  if (!hasDist) {
    await (ctx as any).render('src/template/default/index.pug', { data, posts, totalRank })
  } else {
    ctx.redirect('/html/index.html')
  }
})

/**
 * 文章页面
 */
// router.get('post/:id', async (ctx, next) => {
//   let hasDist = await fileExist('dist/index.html')
//   // 获取数据库中的栏目
//   const dataModel = []
//   // const posts = parseModel2Json(await Category.getMainCategory())
//   // let posts = {}
//   let data = parseModel2Json(dataModel)
//   // let totalRank = parseModel2Json(await Posts.getReadingRank())
//   let detail = {}
//   // 不存在，使用模版文件，否则访问已存在的文件
//   if (!hasDist) {
//     await ctx.render('template/default/post.pug', {
//       id: ctx.params.id,
//       data,
//       detail,
//     })
//   } else {
//     ctx.redirect(`/html/${ctx.params.id}.html`)
//   }
// })

/**
 * 分类页面
 */
// router.get('category/:id', async (ctx, next) => {
//   const category = ctx.params.id
//   let hasDist = await fileExist(`dist/category/${category}/index.html`)

//   const posts ={}
//   // let posts = {}
//   // 不存在，使用模版文件，否则访问已存在的文件
//   if (!hasDist) {
//     await ctx.render('template/default/category.pug', {
//       id: ctx.params.id,
//       posts,
//     })
//   } else {
//     ctx.redirect(`/html/${ctx.params.id}.html`)
//   }
// })

/**
 * 频道页面
 */
// router.get('/channel/:id', async (ctx, next) => {
//   const category = ctx.params.category
//   let hasDist = await fileExist(`dist/${category}/index.html`)
//   // 不存在，使用模版文件，否则访问已存在的文件
//   if (!hasDist) {
//     await ctx.render('template/default/category.pug', { id: ctx.params.id })
//   } else {
//     ctx.redirect(`/html/${ctx.params.id}.html`)
//   }
// })

/**
 * 单独页面
 */
// router.get('/pages/:id', async (ctx, next) => {
//   const category = ctx.params.category
//   let hasDist = await fileExist(`dist/${category}/index.html`)
//   // 不存在，使用模版文件，否则访问已存在的文件
//   if (!hasDist) {
//     await ctx.render('template/default/category.pug', { id: ctx.params.id })
//   } else {
//     ctx.redirect(`/html/${ctx.params.id}.html`)
//   }
// })

// router.get('sys/build', async (ctx, next) => {
//   const html = renderFile('template/default/index.pug', {})
//   writeFile('dist/index.html', html, (err) => {
//     if (err) {
//       console.log('writeFile Error', err)
//     }
//     console.log('writeFile Success!')
//   })
// })

export default router
