import { Status, UserType } from './../lib/enum';
import * as bcrypt from 'bcryptjs'
import { Entity, Column, BeforeUpdate } from 'typeorm';
import EntityBase from '.';

@Entity({ name: 'xs_user', })
export class User extends EntityBase {

  @Column({ comment: '用户角色id集' })
  roles: string;

  @Column({ comment: '用户角色名称集' })
  roleNames: string;

  @Column({ comment: '用户昵称', nullable: true })
  nickname: string;

  @Column({ comment: '用户名称' })
  username: string;

  @Column({ comment: '用户头像' })
  avatar: string;

  @Column({ comment: '微信头像' })
  wechat: string;

  @Column({ comment: '用户QQ号码' })
  qq: string;

  @Column({ comment: '用户手机号', length: 11 })
  mobile: string;

  @Column({ comment: '上次登录时间' })
  lastLoginTime: Date;

  @Column({ comment: '上次登录地址' })
  lastLoginIp: string;

  @Column({type: "enum", comment: '用户类型 ', default: UserType.APP, enum: UserType })
  usertype: number;

  @Column({ comment: '用户邮箱' })
  email: string;

  @Column({ comment: '用户的openid', length: 64 })
  openid: string;

  @Column({ comment: '用户密码' })
  password: string;

  @BeforeUpdate()
  updatePassword() {
    const sault = bcrypt.genSaltSync(10)
    const psw = bcrypt.hashSync(this.password, sault)
    this.password = psw
  }
}