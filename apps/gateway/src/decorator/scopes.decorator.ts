import { SixShopServiceType } from '@libs/common/constant/six-shop-service-type';
import { SetMetadata } from '@nestjs/common';

export const Scopes = (...scopes: SixShopServiceType[]) =>
  SetMetadata('scopes', scopes);
