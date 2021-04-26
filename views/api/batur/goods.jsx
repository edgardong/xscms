import { get, post, put, del } from '@/utils/request'

import BaseApi from '../base'

let APIS = new BaseApi('batur', 'goods')

APIS.getBase = params => get(`${APIS.base_url}/base`, params)

export default APIS
