import { StringTransform } from '@libs/common/transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterProductInput {
  email: string;

  @ApiProperty({ nullable: false, required: true })
  @StringTransform()
  storeId!: string;

  @ApiProperty({ nullable: false, required: true })
  @StringTransform()
  name!: string;

  @ApiProperty({ nullable: false, required: true })
  price: string;

  @ApiProperty({ nullable: false, required: true })
  categories: string[];
}
