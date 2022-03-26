import { StringTransform } from '@libs/common/transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CustomInput } from '.';

export class UpdateShopInput {
  email: string;

  @ApiProperty({ nullable: false, required: true })
  @StringTransform()
  name?: string;

  @ApiProperty({ nullable: false, required: true })
  shopId?: string;

  @ApiProperty({
    type: CustomInput,
    description: 'custom data',
    nullable: true,
  })
  custom?: CustomInput;
}
