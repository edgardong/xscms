class WecException extends Error {
  msg: any
  code: number
  errorCode: any

  constructor(msg: string, errorCode: number) {
    super()
    this.msg = msg || '服务器未知错误'
    this.code = 200
    this.errorCode = errorCode || 50001
  }
}

export default WecException