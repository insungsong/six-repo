import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { SixShopServiceType } from '../constant/six-shop-service-type';
import { StringTransform } from '../transformer/string.transform.decorator';

export class AuthenticationInput {
  @Length(6, 320)
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({ nullable: false, description: '이메일' })
  @StringTransform()
  email!: string;

  @Length(8, 16)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ nullable: false, description: '비밀번호' })
  @StringTransform()
  password!: string;

  @IsNotEmpty()
  @IsEnum(SixShopServiceType)
  @ApiProperty({
    enum: SixShopServiceType,
    nullable: false,
    description: 'SixShop 서비스 타입',
  })
  service!: SixShopServiceType;
}
