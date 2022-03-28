import { StringTransform } from '@libs/common/transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FetchProductsInput {
  email: string;

  @ApiProperty({ nullable: false, required: true })
  @StringTransform()
  storeId!: string;
}
