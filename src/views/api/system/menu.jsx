import { get, post, put, del } from '@/utils/request'

import BaseApi from '../base'

const base_url = 'api/system/v1/menu'

let MenuApi = new BaseApi('system', 'menu')

MenuApi.getList = params => get(`${base_url}/pagination`, params)
MenuApi.get = params => get(base_url, params)
MenuApi.delete = data => del(base_url, data)
MenuApi.add = data => post(base_url, data)
MenuApi.update = data => put(base_url, data)
MenuApi.getAll = params => get(`${base_url}/all`, params || {})
MenuApi.getTree = params => get(`${base_url}/tree`, params || {})
MenuApi.getByRoleId = params => get(`${base_url}/byrole`, params)
MenuApi.saveByRole = data => post(`${base_url}/byrole`, data)

export default MenuApi
