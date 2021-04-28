import { get, post, put, del } from '@/utils/request'

import BaseApi from '../base'

let APIS = new BaseApi('batur', 'order')

APIS.addBtrOrder = data => post(`${APIS.base_url}/addOrder`, data)
APIS.updateBtrOrder = data => put(`${APIS.base_url}/updateOrder`, data)

export default APIS
