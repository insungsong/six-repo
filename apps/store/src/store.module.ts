import { SixShopConfigModule } from '@libs/common/config/config.module';
import { DatabaseModule } from '@libs/database';
import {
  AdditionalRequirementRepository,
  CustomerRepository,
  StoreRepository,
} from '@libs/database/respository';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';

@Module({
  imports: [
    SixShopConfigModule,
    DatabaseModule,
    TypeOrmModule.forFeature([
      CustomerRepository,
      StoreRepository,
      AdditionalRequirementRepository,
    ]),
  ],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
