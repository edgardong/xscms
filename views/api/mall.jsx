import { get, post, put, del } from '@/utils/request'

/**
 * 获取分页商品分类
 * @param {*} params 分类的参数
 */
export function getCategory(params) {
  return get('api/store/v1/category/pagination', params)
}

/**
 * 获取所有商品分类
 */
export function getAllCategories(){
  return get('api/store/v1/category/all')
}

/**
 * 删除分类
 * @param {*} id
 */
export function delCategory(id) {
  return del('api/store/v1/category/' + id)
}

/**
 * 添加分类
 * @param {*} data 表单
 */
export function addCategory(data) {
  return post('api/store/v1/category', data)
}

/**
 * 更新分类数据
 * @param {*} data 表单
 */
export function putCategory(data) {
  return put('api/store/store/v1/category', data)
}

/**
 * 根据商品分类获取商品列表
 * @param {*} params 
 */
export function getAllGoodsList(params){
  return get('api/store/v1/product/all',params)
}

/**
 * 获取商品详情
 * @param {*} id 
 */
export function getProductDetail(id){
  return get('api/store/v1/product/'+id)
}

/**
 * 获取所有订单数据
 * @param {*} params 
 */
export function getAllOrder(params){
  return get('api/store/v1/order/paginate',params)
}
