import { get, post, put, del } from '@/utils/request'

import BaseApi from '../base'

let baseApi = new BaseApi('system', 'base')

baseApi.getList = (model, params) =>
  get(`${baseApi.base_url}/pagination`, { ...params, model })
baseApi.get = (model, params) => get(baseApi.base_url, { ...params, model })
baseApi.delete = (model, data) => del(baseApi.base_url, data, { model })
baseApi.add = (model, data) => post(baseApi.base_url, data, { model })
baseApi.update = (model, data) => put(baseApi.base_url, data, { model })
baseApi.getAll = (model, params) =>
  get(`${baseApi.base_url}/all`, { ...params, model } || {})
baseApi.getColumns = model => get(`${baseApi.base_url}/columns`, { model })

export default baseApi
