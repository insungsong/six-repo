import { ApiProperty } from '@nestjs/swagger';

export class FetchMyShopInput {
  email: string;

  @ApiProperty({ nullable: false, required: true })
  shopId?: string;
}
