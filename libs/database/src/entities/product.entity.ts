import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('product')
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
    comment: 'product id',
  })
  id!: string;

  @Column({ name: 'seq', type: 'int8', unique: true, comment: '순차 인덱스' })
  @Generated('increment')
  seq!: number;

  @Column({ name: 'store_id', type: 'uuid', comment: 'fk 상정 고유 ID' })
  storeId: string;

  @Column({
    name: 'name',
    comment: '상품 이름',
  })
  name: string;

  @Column({
    name: 'price',
    comment: '상품 가격',
  })
  price: number;

  @Column('varchar', {
    array: true,
    name: 'categories',
    comment: '상품 카테고리 목록',
  })
  categories: string[];

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
