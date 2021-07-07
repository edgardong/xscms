/*
 * @Author: yishusheng
 * @Date: 2021-03-26 18:12:00
 * @version: 1.0.0
 * @LastEditTime: 2021-07-07 17:33:06
 * @LastEditors: yishusheng
 * @Description: 通用工具文件
 */

import * as jwt from 'jsonwebtoken'
import { access, constants, PathLike, writeFile } from 'fs'

const generateToken = function (uid: any, scope: any) {
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
const randomString = (length: number) => {
  var result = '';
  let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

/**
 * 检查指定路径下的文件是否存在
 * @param file 文件路径
 * @returns boolean
 */
 const fileExist = (file: PathLike) =>
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

export default {
  generateToken,
  randomString,
  fileExist
}