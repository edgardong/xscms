import { get, post, put, del } from '@/utils/request'

import BaseApi from '../base'

const base_url = 'api/system/v1/user'

let UserApi = new BaseApi('system', 'user')

/**
 * 获取用户列表
 * @param {*} params
 */
UserApi.getUserList = params => get(`${base_url}/pagination`, params)

UserApi.login = data => post(`api/common/v1/token/login`, data)
/**
 * 获取用户详细信息
 * @param {*} params 参数
 */
UserApi.getUser = params => get(base_url, params)

/**
 * 获取所有用户角色
 */
UserApi.getAllRoles = params => get(`${base_url}/roles`, params)

/**
 * 删除用户信息
 * @param {*} data 用户信息
 */
UserApi.deleteUser = data => del(base_url, data)

/**
 * 添加用户
 * @param {*} data 用户信息
 */
UserApi.addUser = data => post(base_url, data)

/**
 * 更新用户信息
 * @param {*} data 用户信息
 */
UserApi.updateUser = data => put(base_url, data)

export default UserApi
