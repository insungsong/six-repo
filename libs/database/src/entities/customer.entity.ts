import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StoreEntity } from '.';

@Entity('customer')
export class CustomerEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
    comment: 'user id',
  })
  id!: string;

  @Column({ name: 'seq', type: 'int8', unique: true, comment: '순차 인덱스' })
  @Generated('increment')
  seq!: number;

  @Column({
    name: 'name',
    comment: '고객 이름',
  })
  name: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 320,
    comment: '이메일 (로그인 아이디)',
  })
  @Index({
    unique: true,
  })
  email!: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
    comment: '패스워드 argon2',
  })
  password!: string;

  @OneToMany(() => StoreEntity, (shop) => shop.custom)
  shop: Promise<StoreEntity[]>;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    comment: '생성일',
    update: false,
  })
  createdAt!: Date;

  /**
   * updatedAt
   */
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    comment: '수정일',
  })
  updatedAt!: Date;
}
