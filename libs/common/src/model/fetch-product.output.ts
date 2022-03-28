import { ApiProperty } from '@nestjs/swagger';
import { One } from '.';

class FetchProduct {
  @ApiProperty({ nullable: false, description: 'name' })
  id: string;

  @ApiProperty({ nullable: false, description: 'name' })
  seq: string;

  @ApiProperty({ nullable: false, description: 'name' })
  storeId: string;

  @ApiProperty({ nullable: false, description: 'name' })
  customerId: string;

  @ApiProperty({ nullable: false, description: 'name' })
  status: string;

  @ApiProperty({ nullable: false, description: 'name' })
  name: string;

  @ApiProperty({ nullable: false, description: 'name' })
  price: string;

  @ApiProperty({ nullable: false, description: 'name' })
  categories: string;

  @ApiProperty({ nullable: false, description: 'name' })
  createdAt: string;

  @ApiProperty({ nullable: false, description: 'name' })
  updatedAt: string;
}

export class FetchProductOutput extends One(FetchProduct) {}
