import { Column, PrimaryGeneratedColumn } from "typeorm";
import { Status } from "../lib/enum";

export default abstract class EntityBase {
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
}