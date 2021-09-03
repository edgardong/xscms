import { Column, Entity } from 'typeorm'

import EntityBase from './index'

@Entity({ name: 'xs_sys_user_role', synchronize: true })
export default class XsSysUserRole extends EntityBase {
  @Column({  comment: '用户id'})
  user_id: string;

  @Column({  comment: '角色id'})
  role_id: string;
}