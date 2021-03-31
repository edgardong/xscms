import React from 'react'
import axios from 'axios'
import { Spin, Icon } from 'antd'
import BaseConfig from '../../config'

// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    config.url = BaseConfig.BASE_URL + config.url
    Spin.setDefaultIndicator(
      <Icon type="loading" style={{ fontSize: 24 }} spin />
    )
    // 在发送请求之前做些什么
    if (localStorage.getItem('token')) {
      config.headers.source = 'wecadmin'
      config.headers.token = localStorage.getItem('token')
      config.headers.version = '0.0.1'
      config.headers.os = localStorage.getItem('os')
      config.headers.platform = localStorage.getItem('platform')
    } else {
      config.headers.source = 'web'
    }

    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    Spin.spinning = false
    // 公用报错处理
    // if (response.data.errCode != 0) {
    //   // 这里需要弹出公用错误
    //   return Promise.reject(response.data.msg)
    // }
    // 把接口的返回值传递给页面
    return response.data
  },
  function (error) {
    // 对响应错误做点什么
    Spin.spinning = false
    return Promise.reject(error)
  }
)

/**
 * Http Get 请求
 * @param {String} url 请求地址
 * @param {Object} params 请求参数
 */
export const get = (url, params) =>
  axios({
    method: 'get',
    url,
    params,
  })

/**
 * Http POST 请求 用于创建数据
 * @param {String} url 请求地址
 * @param {Object} data 请求参数
 */
export const post = (url, data, params = {}) =>
  axios({
    method: 'post',
    url,
    params,
    data,
  })

/**
 * Http DELETE 请求 用于删除数据
 * @param {String} url 请求地址
 * @param {Object} data 请求参数
 */
export const del = (url, data, params = {}) =>
  axios({
    method: 'delete',
    url,
    params,
    data,
  })

/**
 * Http PUT 请求 用于更新数据
 * @param {String} url 请求地址
 * @param {Object} data 请求参数
 */
export const put = (url, data, params = {}) =>
  axios({
    method: 'put',
    url,
    params,
    data,
  })
