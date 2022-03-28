import { StringTransform } from '@libs/common/transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FetchMyOrdersInput {
  email: string;

  @ApiProperty({ nullable: false, required: true })
  @StringTransform()
  storeId!: string;
}
