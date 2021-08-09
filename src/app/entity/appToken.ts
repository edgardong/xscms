/*
 * @Author: yishusheng
 * @Date: 2021-04-13 18:40:20
 * @version: 1.0.0
 * @Email: 2535615874@qq.com
 * @Github: https://github.com/edgardong
 * @LastEditTime: 2021-08-04 17:13:04
 * @LastEditors: yishusheng
 * @Description: APPToken的实体类
 */


import { Column, Entity } from 'typeorm'
import EntityBase from './index'

@Entity({ name: 'xs_app_token', synchronize: true })
export default class AppToken extends EntityBase {

  //  @Column({ type: 'int', comment: '菜单类型，1:路由，2:权限', default: 1 })
  @Column({ type: 'varchar', comment: 'token值' })
  access_token: string;

  @Column({ type: 'varchar', comment: '有效期' })
  expires_in: string;

  @Column({ type: 'date', comment: '有效期开始时间' })
  start_time: Date;

  @Column({ type: 'varchar', comment: '对应的app' })
  appid: string;

  @Column({ type: 'varchar', comment: '描述' })
  description: string;
}
