import { get, post, put, del } from '@/utils/request'

import BaseApi from '../base'

let APIS = new BaseApi('batur', 'order')

APIS.getBase = params => get(`${APIS.base_url}/order`, params)

export default APIS
