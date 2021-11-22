import { get, post, put, del } from '@admin/utils/request'

import BaseApi from '../base'

let APIS = new BaseApi('blog', 'category')

APIS.getList = params => get(`${APIS.base_url}/pagination`, params)
APIS.get = params => get(APIS.base_url, params)
APIS.delete = data => del(APIS.base_url, data)
APIS.add = data => post(APIS.base_url, data)
APIS.update = data => put(APIS.base_url, data)
APIS.getAll = params => get(`${APIS.base_url}/all`, params || {})
APIS.getTree = params => get(`${APIS.base_url}/tree`, params || {})
APIS.getByRoleId = params => get(`${APIS.base_url}/byrole`, params)
APIS.saveByRole = data => post(`${APIS.base_url}/byrole`, data)
APIS.getHotTag = params => get(`${APIS.base_url}/hottag`, params)

export default APIS
