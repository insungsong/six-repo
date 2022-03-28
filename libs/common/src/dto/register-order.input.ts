import { StringTransform } from '@libs/common/transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterOrderInput {
  email: string;

  @ApiProperty({ nullable: false, required: true })
  @StringTransform()
  storeId!: string;

  @ApiProperty({ nullable: false, required: true })
  productId!: string;
}
