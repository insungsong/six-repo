import { OrderStatus } from '@libs/common/constant/order-status';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('order')
export class OrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
    comment: '주문 고유 id',
  })
  id!: string;

  @Column({ name: 'seq', type: 'int8', unique: true, comment: '순차 인덱스' })
  @Generated('increment')
  seq!: number;

  @Column({ name: 'customer_id', type: 'uuid', comment: 'fk customer ID' })
  customerId: string;

  @Column({ name: 'store_id', type: 'uuid', comment: 'fk 상점 고유 ID' })
  storeId: string;

  @Column({ name: 'product_id', type: 'uuid', comment: '상품 ID' })
  productId: string;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 255,
    comment: '상태 SixShopRfqStatus',
  })
  status!: OrderStatus;

  @Column({
    name: 'confirm_payment',
    type: 'boolean',
    comment: '입금 확인',
    default: false,
  })
  confirmPayment!: boolean;

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
