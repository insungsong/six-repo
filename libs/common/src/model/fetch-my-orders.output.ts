import { ApiProperty } from '@nestjs/swagger';
import { Many } from '.';

class FetchMyOrders {
  @ApiProperty({ nullable: false, description: 'orderNumber' })
  orderNumber: string;

  @ApiProperty({ nullable: false, description: 'customerName' })
  customerName: string;

  @ApiProperty({ nullable: false, description: 'createdAt' })
  createdAt: string;

  @ApiProperty({ nullable: false, description: 'productName' })
  productName: string;

  @ApiProperty({ nullable: false, description: 'productPrice' })
  productPrice: string;

  @ApiProperty({ nullable: false, description: 'orderStatus' })
  orderStatus: string;
}

export class FetchMyOrdersOutput extends Many(FetchMyOrders) {}
