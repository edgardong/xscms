/*
 * @Author: yishusheng
 * @Date: 2021-07-07 16:56:22
 * @version: 1.0.0
 * @LastEditTime: 2021-07-07 17:04:30
 * @LastEditors: yishusheng
 * @Description: 第三方APP实体
 */

import { Column, Entity } from 'typeorm'

import EntityBase from './index'

@Entity({ name: 'xs_third_app', synchronize: true })
export class XsThirdApp extends EntityBase {

  @Column({ comment: '应用app_id' })
  app_id: string;

  @Column({comment: '应用密钥'})
  app_secret: string;

  @Column({  comment: '应用描述' })
  app_description: string;

  @Column({ comment: '应用权限'})
  scope: string;

  @Column({ comment: '权限描述' })
  scope_description: string;

}

export default  XsThirdApp
