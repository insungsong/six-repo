import { SixShopConfigModule } from '@libs/common/config/config.module';
import { SixShopConfigService } from '@libs/common/config/config.service';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

async function ormConfig(): Promise<TypeOrmModuleOptions> {
  const cli = await NestFactory.create<NestExpressApplication>(
    SixShopConfigModule,
  );
  cli.useGlobalPipes(new ValidationPipe());

  const config: SixShopConfigService =
    cli.get<SixShopConfigService>(SixShopConfigService);

  const ormConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: config.dbHost,
    port: config.dbPort,
    username: config.dbUsername,
    password: config.dbPassword,
    database: config.dbDatabase,
    schema: config.dbSchema,
    keepConnectionAlive: true,
    entities: [],
    subscribers: [],
    synchronize: config.dbSync,
    logging: config.dbDebug,
    extra: {
      connectionLimit: 5,
    },
  };

  return Promise.resolve(ormConfig);
}

export = ormConfig();
