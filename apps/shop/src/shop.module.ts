import { SixShopConfigModule } from '@libs/common/config/config.module';
import { DatabaseModule } from '@libs/database';
import {
  AdditionalRequirementRepository,
  CustomerRepository,
  ShopRepository,
} from '@libs/database/respository';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';

@Module({
  imports: [
    SixShopConfigModule,
    DatabaseModule,
    TypeOrmModule.forFeature([
      CustomerRepository,
      ShopRepository,
      AdditionalRequirementRepository,
    ]),
  ],
  controllers: [ShopController],
  providers: [ShopService],
})
export class ShopModule {}
