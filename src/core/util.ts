const jwt = require('jsonwebtoken')

const generateToken = function (uid, scope) {
  const secretKey = global.config.security.secretKey
  const expiresIn = global.config.security.expiresIn
  // 生成令牌
  const token = jwt.sign({
    uid,
    scope
  }, secretKey, {
    expiresIn
  })
  return token
}

/**
 * 生成指定长度的随机字符串
 * @param {Integer} length 随机字符串长度
 */
const randomString = (length) => {
  var result = '';
  let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

module.exports = {
  generateToken,
  randomString
}