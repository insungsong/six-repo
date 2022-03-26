import { SixShopConfigModule } from '@libs/common/config/config.module';
import { DatabaseModule } from '@libs/database';
import { CustomerRepository } from '@libs/database/respository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Module({
  imports: [
    SixShopConfigModule,
    DatabaseModule,
    TypeOrmModule.forFeature([CustomerRepository]),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule {}
