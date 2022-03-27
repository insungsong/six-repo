import { EntityRepository, Repository } from 'typeorm';
import { StoreEntity } from '../entities';

@EntityRepository(StoreEntity)
export class StoreRepository extends Repository<StoreEntity> {}
