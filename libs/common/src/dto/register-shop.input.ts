import { StringTransform } from '@libs/common/transformer';
import { ApiProperty } from '@nestjs/swagger';

import { CustomType } from '../constant/custom.type';

export class CustomInput {
  [key: string]: CustomType;
}

export class RegisterShopInput {
  email: string;

  @ApiProperty({ nullable: false, required: true })
  @StringTransform()
  name?: string;

  @ApiProperty({
    description: 'custom data',
    required: true,
    nullable: true,
  })
  custom?: CustomInput;
}
