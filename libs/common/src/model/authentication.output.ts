import { One } from '@libs/common/model/output.model';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Authentication
 *
 * @TODO fill description
 */

export class Authentication {
  @ApiProperty({ nullable: false, description: 'accessToken JWT' })
  accessToken!: string;

  @ApiProperty({ nullable: false, description: 'token type' })
  tokenType!: string;

  @ApiProperty({ nullable: false, description: 'expiresIn' })
  expiresIn!: number;

  @ApiProperty({ nullable: false, description: 'JWT' })
  refreshToken!: string;
}

export class AuthenticationOutput extends One(Authentication) {}
