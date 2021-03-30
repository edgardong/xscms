const util = require('util')
const axios = require('axios')

const {
  User
} = require('../models/user')
const {
  Auth
} = require('../../middlewares/auth')
const AppToken = require('../models/appToken')
const {
  generateToken
} = require('../../core/util')

class WXManager {

  /**
   * 根据小程序生成token
   * @param {String} code 小程序code
   */
  static async codeToToken(code) {
    //
    const url = util.format(global.config.miniProgram.loginUrl, global.config.miniProgram.appid, global.config.miniProgram.appSecret, code)
    const result = await axios.get(url)
    if (result.status != 200) {
      throw new global.errs.AuthFailed('获取openid失败')
    }
    // console.log(result.data)
    const errcode = result.data.errcode
    if (errcode) {
      throw new global.errs.AuthFailed(result.data.errmsg + " : " + errcode)
    }

    const {
      openid,
      session_key,
      unionid
    } = result.data

    let user = await User.getUserByOpenId(openid)
    if (!user) {
      user = await User.registerUserByOpenId(openid)
    }

    return generateToken(user.id, Auth.USER)

  }

  /**
   * 获取access_token
   */
  static async getAccessToken(appid, appSecret) {
    const localToken = await AppToken.findOne({
      where: {
        appid
      }
    })
    if (localToken) {
      const currentTime = new Date().getTime()
      console.log(new Date(localToken.start_time))
      if (new Date(localToken.start_time).getTime() + localToken.expires_in < currentTime - 20) {
        return localToken.access_token
      }
    }
    let url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=%s&secret=%s'
    let requestUrl = util.format(url, appid, appSecret)
    // 校验本地是否过期
    // 过期则请求新的token，并缓存本地
    const result = await axios.get(requestUrl)
    const data = result.data
    if (!data.access_token) {
      throw new Error('获取token失败 ' + data.errmsg)
    }
    if (!localToken) {
      AppToken.create({
        appid,
        access_token: data.access_token,
        expires_in: data.expires_in,
        start_time: new Date()
      })
    } else {
      AppToken.update({
        access_token: data.access_token,
        expires_in: data.expires_in,
        start_time: new Date()
      }, {
        where: {
          appid
        }
      })
    }
    return data.access_token
  }
}

module.exports = WXManager