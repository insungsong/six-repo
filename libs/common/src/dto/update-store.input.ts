import { StringTransform } from '@libs/common/transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CustomInput } from '.';

export class UpdateStoreInput {
  email: string;

  @ApiProperty({ nullable: false, required: true })
  @StringTransform()
  name?: string;

  @ApiProperty({ nullable: false, required: true })
  storeId?: string;

  @ApiProperty({
    type: CustomInput,
    description: 'custom data',
    nullable: true,
  })
  custom?: CustomInput;
}
