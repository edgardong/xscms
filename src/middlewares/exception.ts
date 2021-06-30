import { WecException } from '../../wec-tools'

const catchError = async (ctx: { body: { msg: any; error_code: any; request: string }; method: any; path: any; status: number }, next: () => any) => {
  try {
    await next()
  } catch (error) {
    // throw error
    const isHttpException = error instanceof WecException
    const isDev = global.config.enviroment === 'dev'
    if (isDev && !isHttpException) {
      throw error
    }
    // 处理已知异常
    if (isHttpException) {
      // throw error
      ctx.body = {
        msg: error.msg,
        error_code: error.errorCode,
        request: `${ctx.method} ${ctx.path}`
      }
      ctx.status = error.code
    } else {
      ctx.body = {
        msg: 'We made a mistake',
        error_code: 50001,
        request: `${ctx.method} ${ctx.path}`
      }
      ctx.status = 500
    }
  }
}

export default catchError