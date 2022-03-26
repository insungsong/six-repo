import { SixShopConfigModule } from '@libs/common/config/config.module';
import { Module } from '@nestjs/common';
import { ProxyModule } from './proxy/proxy.module';
import { StrategyModule } from './strategy/strategy.module';

@Module({
  imports: [ProxyModule, StrategyModule, SixShopConfigModule, StrategyModule],
})
export class GatewayModule {}
