import {
  get,
  post,
  put,
  del
} from '@/utils/request'

export default class BaseApi {

  /**
   * 构造一个具有``增删改查``基本API的模块
   * @param {*} module 大模块 默认为system
   * @param {*} model  小模块 默认为user
   * @param {*} version api版本号，默认为v1
   */
  constructor(module = 'system', model = 'user', version = 'v1') {
    this.base_url = `api/${module}/${version}/${model}`
    this.modelName = model.charAt(0).toUpperCase() + model.slice(1)
    // 获取一条数据
    this[`get${this.modelName}`] = params => get(this.base_url, params)
    // 获取数据分页
    this[`get${this.modelName}PageList`] = params => get(`${this.base_url}/pagenation`, params)
    // 添加一条数据
    this[`add${this.modelName}`] = data => post(this.base_url, data)
    // 修改一条数据
    this[`update${this.modelName}`] = data => put(this.base_url, data)
    // 删除一条数据
    this[`delete${this.modelName}`] = data => del(this.base_url, data)
  }
}