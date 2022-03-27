import { StroeStatus } from '@libs/common/constant';
import { CustomInput } from '@libs/common/dto/register-store.input';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomerEntity } from '.';

@Entity('store')
export class StoreEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
    comment: '상점 id',
  })
  id!: string;

  @Column({ name: 'seq', type: 'int8', unique: true, comment: '순차 인덱스' })
  @Generated('increment')
  seq!: number;

  @Column({
    name: 'name',
    comment: '상점 이름',
    nullable: false,
  })
  name!: string;

  @Column({
    name: 'customer_id',
    type: 'uuid',
    comment: 'fk 유저 id',
    nullable: false,
  })
  customerId!: string;

  @Column({
    name: 'status',
    type: 'varchar',
    comment: 'shop 상태값',
    nullable: false,
  })
  status!: StroeStatus;

  @Column({
    name: 'custom',
    type: 'jsonb',
    nullable: true,
    comment: 'custom data',
  })
  custom?: CustomInput;

  @ManyToOne(() => CustomerEntity, (customer) => customer.shop, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'customer', referencedColumnName: 'id' })
  customer: CustomerEntity;

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
