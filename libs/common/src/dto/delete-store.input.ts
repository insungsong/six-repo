import { ApiProperty } from '@nestjs/swagger';

export class DeleteStoreInput {
  email: string;

  @ApiProperty({ nullable: false, required: true })
  storeId?: string;
}
