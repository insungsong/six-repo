import { EntityRepository, Repository } from 'typeorm';
import { OrderEntity } from '../entities';

@EntityRepository(OrderEntity)
export class OrderRepository extends Repository<OrderEntity> {}
