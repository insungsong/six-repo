import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { SixShopServiceType } from '../constant/six-shop-service-type';
import { StringTransform } from '../transformer/string.transform.decorator';

/**
 * RegisterUserInput
 *
 * @description sixshop 회원가입
 */
export class RegisterUserInput {
  @Length(6, 320)
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ nullable: false, description: '이메일' })
  @StringTransform()
  email!: string;

  @ApiProperty({ nullable: false, description: '이름' })
  name!: string;

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
    description: '유저 서비스 타입',
  })
  service!: SixShopServiceType;
}
