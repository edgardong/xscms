import { Column, PrimaryGeneratedColumn } from "typeorm";

export default abstract class EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column({
    comment: '状态'
  })
  status: number;
}