import { StringTransform } from '@libs/common/transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ProductStatus } from '../constant';

export class UpdateProductInput {
  email: string;

  @ApiProperty({ nullable: false, required: true })
  @StringTransform()
  productId: string;

  @ApiProperty({ nullable: false, required: true })
  @StringTransform()
  name: string;

  @ApiProperty({ nullable: false, required: true })
  @StringTransform()
  price: string;

  @ApiProperty({ nullable: false, required: true })
  @StringTransform()
  categories: string[];
}
