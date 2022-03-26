import { EntityRepository, Repository } from 'typeorm';
import { AdditionalRequirementEntity } from '../entities';

@EntityRepository(AdditionalRequirementEntity)
export class AdditionalRequirementRepository extends Repository<AdditionalRequirementEntity> {}
