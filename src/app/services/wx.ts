
/*
 * @Author: yishusheng
 * @Date: 2021-03-26 18:12:00
 * @version: 1.0.0
 * @Email: 2535615874@qq.com
 * @Github: https://github.com/edgardong
 * @LastEditTime: 2021-08-04 17:14:10
 * @LastEditors: yishusheng
 * @Description: 微信管理类
 */

import { format } from 'util'
import axios from 'axios'
import User from '../models/user'
import Auth from '../../middlewares/auth'
import AppToken from '../entity/appToken'
import util from '../../core/util'
import { getManager } from 'typeorm';

const manager = getManager()

class WXManager {

  /**
   * 根据小程序生成token
   * @param {String} code 小程序code
   */
  static async codeToToken(code) {
    //
    const url = format(global.config.miniProgram.loginUrl, global.config.miniProgram.appid, global.config.miniProgram.appSecret, code)
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

    return util.generateToken(user.id, Auth.USER)

  }

  /**
   * 获取access_token
   */
  static async getAccessToken(appid, appSecret) {
    const localToken = await manager.findOne(AppToken, {
      where: {
        appid
      }
    })
    if (localToken) {
      const currentTime = new Date().getTime()
      console.log(new Date(localToken.start_time))
      if (new Date(localToken.start_time).getTime() + Number(localToken.expires_in) < currentTime - 20) {
        return localToken.access_token
      }
    }
    let url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=%s&secret=%s'
    let requestUrl = format(url, appid, appSecret)
    // 校验本地是否过期
    // 过期则请求新的token，并缓存本地
    const result = await axios.get(requestUrl)
    const data = result.data
    if (!data.access_token) {
      throw new Error('获取token失败 ' + data.errmsg)
    }
    if (!localToken) {
      manager.create(AppToken, {
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

export default WXManager