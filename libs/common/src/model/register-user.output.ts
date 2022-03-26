import { ApiProperty } from '@nestjs/swagger';
import { One } from './output.model';

class RegisterUser {
  @ApiProperty({ nullable: false, description: 'JWT' })
  accessToken: string;

  @ApiProperty({
    nullable: false,
    description: 'tokenType',
  })
  tokenType!: string;

  @ApiProperty({ nullable: false, description: 'expiresIn' })
  expiresIn!: number;

  @ApiProperty({ nullable: false, description: 'JWT' })
  refreshToken!: string;
}

export class RegisterUserOutput extends One(RegisterUser) {}
