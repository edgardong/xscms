import { get, post, put, del } from '@/utils/request'

/**
 * 上传文件
 * @param {*} data 上传的数据
 */
export function uploadFile(data) {
  return post('/api/v1/common/upload', data)
}

/**
 * 上传博客文件
 * @param {*} data 
 */
export function uploadBlogFile(data) {
  return post('/api/system/v1/file', data)
}