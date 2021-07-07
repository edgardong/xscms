/*
 * @Author: yishusheng
 * @Date: 2021-06-23 09:13:58
 * @version: 1.0.0
 * @LastEditTime: 2021-07-07 17:04:06
 * @LastEditors: yishusheng
 * @Description: 网站基本信息实体
 */
import { Column, Entity } from 'typeorm'

import EntityBase from './index'

@Entity({ name: 'xs_site', synchronize: true })
export class XsSite extends EntityBase {
  @Column({ comment: "网站地址", nullable: false })
  url: string;

  @Column({ comment: "网站LOGO", nullable: true })
  logo: string;

  @Column({ comment: "网站分隔符", default: '-' })
  split: string;

  @Column({ comment: "网站标题", })
  title: string;

  @Column({ comment: "网站关键字", })
  keywords: string;

  @Column({ comment: "网站描述", nullable: false })
  description: string;

  @Column({ comment: "网站备案信息", nullable: true })
  icp: string;

  @Column({ type: "text", comment: '底部信息' })
  footer: string;

  @Column({comment:'ico图标地址'})
  ico:string;

  @Column({comment:'百度统计的key'})
  baidu_tongji:string;

  @Column({comment:'Bing推送的key'})
  bing_push:string;

  @Column({comment:'谷歌统计的key'})
  google_tongji:string;
}