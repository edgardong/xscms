import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import EntityBase from '../index'

@Entity()
export class XsSite extends EntityBase {

  url: string;

  logo: string;

  split: string;
  title: string;
  keywords: string;
  description: string;
  icp: string;

  @Column({ type: "text", length: 200 })
  footer: string;


}