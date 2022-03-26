import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SixShopConfigService } from 'libs/common/src/config/config.service';
import { SHOP } from '@libs/common/constant/six-shop-app.name';
import { ShopModule } from './shop.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(ShopModule);

  app.useGlobalPipes(new ValidationPipe());

  const configService: SixShopConfigService =
    app.get<SixShopConfigService>(SixShopConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        `${configService.rabbitmqProto}://${configService.rabbitmqUser}:${configService.rabbitmqPass}@${configService.rabbitmqHost}:${configService.rabbitmqPort}`,
      ],
      queue: SHOP,
      noAck: true,
      queueOptions: {
        durable: true,
      },
    },
  });

  Logger.log(`${SHOP} is running on [${configService.nodeEnv}]`);

  await app.startAllMicroservices();
}
bootstrap();
