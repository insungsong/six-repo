import { ApiProperty } from '@nestjs/swagger';
import { One } from './output.model';

class RegisterUser {
  @ApiProperty({ nullable: true, description: 'shop id' })
  id: string;

  @ApiProperty({ nullable: true, description: '상점 이름' })
  name: string;

  @ApiProperty({ nullable: true, description: '상점 게시자 id' })
  customerId: string;

  @ApiProperty({ nullable: true, description: 'custom data' })
  custom: string;

  @ApiProperty({ nullable: true, description: '생성 날짜' })
  createdAt: string;

  @ApiProperty({ nullable: true, description: '업데이트 날짜' })
  updatedAt: string;
}

export class RegisterUserOutput extends One(RegisterUser) {}
