import { get, post, put, del } from '@/utils/request'

import BaseApi from '../base'
const base_url = 'api/system/v1/role'

let RoleApi = new BaseApi('system', 'role')

RoleApi.getList = (params) => get(`${base_url}/pagination`, params)
RoleApi.get = (params) => get(base_url, params)
RoleApi.delete = (data) => del(base_url, data)
RoleApi.add = (data) => post(base_url, data)
RoleApi.update = (data) => put(base_url, data)
RoleApi.getAll = (params) => get(`${base_url}/all`, params || {})
RoleApi.getOpPermission = (params) =>
  get(`${base_url}/permission/op`, params || {})
RoleApi.saveOpPermisson = (data) =>
  post(`${RoleApi.base_url}/permission/op`, data)

RoleApi.getPermissionTypes = (params) =>
  get(`${RoleApi.base_url}/permission/dataType`, params || {})
RoleApi.getDataPermission = (params) =>
  get(`${base_url}/permission/data`, params || {})
RoleApi.saveDataPermission = (data) =>
  post(`${RoleApi.base_url}/permission/data`, data)

export default RoleApi
