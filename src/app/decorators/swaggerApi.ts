import { request, summary, responses, query, path, body, tags, swaggerClass, swaggerProperty } from 'koa-swagger-decorator'
import { PropertyDecorlator, modules } from './base'

/**
 * token模块装饰器
 * @param {Object}  values 参数对象
 * @param {string} values.module 模块
 * @returns 
 */
function swaggerApi(values: PropertyDecorlator) {
  return function (target: any, name: any, descriptor: any) {

    request(values.method || 'get', `${modules[values.module][1] + values.url}`)(target, name, descriptor)
    summary(values.desc)(target, name, descriptor)
    tags(values.tags || modules[values.module][0])(target, name, descriptor)
    responses({ 200: { description: 'success' }, 400: { description: 'error' } })(target, name, descriptor)
    if (values.body) {
      body(values.body)(target, name, descriptor)
    }
    if (values.path) {
      path(values.path)(target, name, descriptor)
    }
    if (values.query) {
      query(values.query)(target, name, descriptor)
    }
  }
}


export default swaggerApi
