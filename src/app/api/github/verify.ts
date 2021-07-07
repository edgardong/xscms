// import crypto = require('crypto')
// const debug = require('debug')('router')
// const secret = 'd0a0933cac6033e26eba53e0711d0df4'
// const verify = async (ctx, next) => {
//   const signature = ctx.get('X-Hub-Signature') || ctx.get('X-Gitee-Token')
//   const name = ctx.get('name')
//   const body = ctx.request.body
//   if (!signature || !body) {
//     ctx.throw(401)
//   } else {
//     await next()
//     // const hash =
//     //   'sha1=' +
//     //   crypto
//     //     .createHmac('sha1', secret)
//     //     .update(JSON.stringify(ctx.request.body))
//     //     .digest('hex')

//     //   console.log('....', hash)
//     // if (signature != hash) {
//     //   ctx.throw(401)
//     // } else {
//     //   await next()
//     // }
//   }
// }

// module.exports = {
//   verify,
// }
