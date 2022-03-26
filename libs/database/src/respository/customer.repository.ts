import { CustomerEntity } from '../entities/customer.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(CustomerEntity)
export class CustomerRepository extends Repository<CustomerEntity> {
  async findRegisteredUserByEmail(
    email: string,
  ): Promise<CustomerEntity | undefined> {
    return this.findOne({
      email: email,
    });
  }
}
