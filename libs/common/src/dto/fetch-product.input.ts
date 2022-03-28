import { StringTransform } from '@libs/common/transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FetchProductInput {
  email: string;

  @ApiProperty({ nullable: false, required: true })
  @StringTransform()
  storeId!: string;

  @ApiProperty({ nullable: false, required: true })
  @StringTransform()
  productId!: string;
}
