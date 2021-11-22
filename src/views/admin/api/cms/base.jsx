import { get, post, put, del } from '@admin/utils/request'

import BaseApi from '../base'

let APIS = new BaseApi('blog', 'base')

APIS.getBase = params => get(`${APIS.base_url}/base`, params)

export default APIS
