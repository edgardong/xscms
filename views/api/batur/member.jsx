import { get, post, put, del } from '@/utils/request'

import BaseApi from '../base'

let APIS = new BaseApi('batur', 'member')

APIS.getBase = params => get(`${APIS.base_url}/member`, params)

export default APIS
