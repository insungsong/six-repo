import { ApiProperty } from '@nestjs/swagger';

export class FetchMyStoreInput {
  email: string;

  @ApiProperty({ nullable: false, required: true })
  storeId?: string;
}
