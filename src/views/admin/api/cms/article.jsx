import { get, post, put, del } from '@admin/utils/request'

const BASE_URL = 'api/blog/v1/article'

/**
 * 分页获取文章列表
 * @param {Object} params 参数
 */
export const getArticleList = (params) =>
  get(`${BASE_URL}/pagination`, { ...params, type: 'all' })

/**
 * 获取文章详情
 * @param {*} id 参数
 */
export const getArticle = (id) => get(`${BASE_URL}/${id}`)

/**
 * 保存文章信息
 * @param {object} data 文章数据
 */
export const saveArticle = (data) => post(BASE_URL, data)

export const publishArticle = (id) => post(`${BASE_URL}/publish`, { id })

/**
 * 删除文章
 * @param {*} id 文章的id
 */
export const delArticle = (id) => del(BASE_URL, { id })
