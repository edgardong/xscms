/*
 * @Author: yishusheng
 * @Date: 2021-07-07 16:56:22
 * @version: 1.0.0
 * @LastEditTime: 2021-07-07 17:04:30
 * @LastEditors: yishusheng
 * @Description: 菜单实体
 */

import { Column, Entity } from 'typeorm'

import EntityBase from './index'

@Entity({ name: 'xs_sys_menu', synchronize: true })
export class XsMenu extends EntityBase {

  @Column({ comment: '上级菜单' })
  pid: string;

  @Column({ type: 'int', comment: '菜单类型，1:路由，2:权限', default: 1 })
  type: number;

  @Column({ type: 'int', comment: '菜单适用平台，1:后端管理， 2:前台网站， 3: 移动端', default: 1 })
  plateform: number;

  @Column({ comment: '菜单图标', nullable: true })
  icon: string;

  @Column({ comment: '菜单地址' })
  url: string;

  @Column({ type: 'int', comment: '菜单排序' })
  order: number;

  @Column({ comment: '菜单描述', nullable: true })
  desc: string;

}
