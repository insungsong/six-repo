import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { Environment, SixShopConfigService } from './config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      ignoreEnvFile: false,
      envFilePath: [
        join(__dirname, '../../..', `${Environment.LOCAL}.env`),
        join(__dirname, '../../..', `${Environment.DEFAULT}.env`),
      ],
    }),
  ],
  providers: [ConfigService, SixShopConfigService],
  exports: [ConfigService, SixShopConfigService],
})
export class SixShopConfigModule {}
