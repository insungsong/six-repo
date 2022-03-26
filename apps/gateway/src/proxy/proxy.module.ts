import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { ShopModule } from './shop/shop.module';

@Module({
  imports: [AuthenticationModule, ShopModule],
})
export class ProxyModule {}
