import { SixShopServiceType } from '@libs/common/constant/six-shop-service-type';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { Scopes } from '.';
import { ScopeAuthGuard } from '../guard';
import { SixShopAuthGuard } from '../guard/six-shop-auth.guard';

export function ScopedAuth(scopes: SixShopServiceType[]) {
  return applyDecorators(
    Scopes(...scopes),
    UseGuards(SixShopAuthGuard, ScopeAuthGuard),
  );
}
