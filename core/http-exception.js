const {
  WecException
} = require('../wec-tools')
class WecHttpException extends WecException {
  constructor(msg = '服务器错误', errorCode = 10000, code = 200) {
    super()
    this.errorCode = errorCode
    this.code = code
    this.msg = msg
  }
}

class ParameterException extends WecHttpException {
  constructor(msg, errorCode) {
    super()
    this.code = 400
    this.msg = msg || '参数错误'
    this.errorCode = errorCode || 40000
  }
}

class Success extends WecHttpException {
  constructor(msg, errorCode) {
    super()
    this.code = 201
    this.msg = msg || 'ok'
    this.errorCode = errorCode || 0
  }
}

class NotFound extends WecHttpException{
  constructor(msg, errorCode) {
    super()
    this.code = 200
    this.msg = msg || '资源没找到'
    this.errorCode = errorCode || 40004
  }
}

class AuthFailed extends WecHttpException{
  constructor(msg, errorCode) {
    super()
    this.code = 200
    this.msg = msg || '用户授权失败'
    this.errorCode = errorCode || 40001
  }
}

class Forbidden extends WecHttpException {
  constructor(msg, errorCode){
    super()
    this.code = 200
    this.msg = msg || '禁止访问'
    this.errorCode = errorCode || 40003
  }
}


module.exports = {
  WecHttpException,
  ParameterException,
  Success,
  NotFound,
  AuthFailed,
  Forbidden
}