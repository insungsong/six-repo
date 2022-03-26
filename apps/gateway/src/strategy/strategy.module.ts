import { SixShopConfigModule } from '@libs/common/config/config.module';
import { SixShopConfigService } from '@libs/common/config/config.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

/**
 * @TODO check
 */

@Module({
  imports: [
    PassportModule.register({ defatulStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [SixShopConfigModule],
      useFactory: async (config: SixShopConfigService) => ({
        secret: config.jwtSecret,
      }),
      inject: [SixShopConfigService],
    }),
  ],
  providers: [JwtStrategy],
})
export class StrategyModule {}
