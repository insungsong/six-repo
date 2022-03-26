import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { SixShopErrorCode } from '../constant/six-shop-error-code';

export class Output {
  @ApiProperty()
  result!: SixShopErrorCode;

  @ApiProperty()
  errorMessage?: string | null;
}

export function One<T>(classRef: Type<T>): any {
  abstract class ObjType extends Output {
    @ApiProperty()
    data?: T;
  }
  return ObjType;
}

export function Many<T>(classRef: Type<T>): any {
  abstract class ObjType extends Output {
    @ApiProperty()
    data?: T[];
  }
  return ObjType;
}
