/*
 * @Author: yishusheng
 * @Date: 2021-06-23 09:08:36
 * @version: 1.0.0
 * @LastEditTime: 2021-07-07 15:32:07
 * @LastEditors: yishusheng
 * @Description: 实体基本字段抽象类
 */
import { Column, CreateDateColumn, DeleteDateColumn, Generated, PrimaryGeneratedColumn, UpdateDateColumn, getConnection } from "typeorm"
import { Status } from "../lib/enum"

abstract class EntityBase {
  @PrimaryGeneratedColumn({ comment: '主键' })
  id: number;

  @Column({ comment: '名称' })
  name: string;

  @Column({ comment: '编码' })
  code: string;

  @Column({
    type: "enum",
    enum: Status,
    default: Status.ENABLE,
    comment: '状态'
  })
  status: number;

  @Column({ comment: '所属者' })
  ownerid: number;

  @Column({ comment: '拥有者名称' })
  ownername: string;

  @Column({ comment: '所属组织' })
  orginazition: string;

  @Column({ comment: '组织名称' })
  orginazitionName: string;

  @Column({ comment: '所属部门' })
  department: string;

  @Column({ comment: '部门名称' })
  departmentName: string;

  @Column({ unique: true, comment: '唯一标识' })  // 唯一
  @Generated("uuid") // 自动生成列
  uuid: string;

  @CreateDateColumn({ comment: '创建时间' })  // 自动生成列
  createdAt: string

  @UpdateDateColumn({ comment: '更新时间' })   // 自动生成并自动更新列
  updatedAt: string

  @DeleteDateColumn({ comment: '删除时间', nullable: true })   // 自动生成并自动更新列
  deleteAt: string

  /**
   * 更新一条数据
   */
  static update: (values: any, where: any) => Promise<any>;
}

EntityBase.update = async function (values, where) {
  let whereStr = ''
  for (let k in where) {
    whereStr += `${k}=:${k}`
  }

  let result = await getConnection()
    .createQueryBuilder()
    .update(this)
    .set(values)
    .where(whereStr, where)
    .execute()
  return result
}



export default EntityBase