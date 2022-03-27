import { ApiProperty } from '@nestjs/swagger';
import { Many } from '.';
import { CustomInput } from '../dto';

class FetchMyShops {
  @ApiProperty({ nullable: false, description: 'name' })
  name: string;

  @ApiProperty({ nullable: false, description: 'customerId' })
  customerId: string;

  @ApiProperty({ nullable: false, description: 'status' })
  status: string;

  @ApiProperty({ nullable: false, description: 'custom' })
  custom: CustomInput;

  @ApiProperty({ nullable: false, description: 'createdAt' })
  createdAt: string;

  @ApiProperty({ nullable: false, description: 'updatedAt' })
  updatedAt: string;
}

export class FetchMyShopsOutput extends Many(FetchMyShops) {}
