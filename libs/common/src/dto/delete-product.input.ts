import { ApiProperty } from '@nestjs/swagger';

export class DeleteProductInput {
  email: string;

  @ApiProperty({ nullable: false, required: true })
  productId?: string;
}
