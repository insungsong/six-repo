import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SixShopConfigService } from 'libs/common/src/config/config.service';
import { STORE } from '@libs/common/constant/six-shop-app.name';
import { StoreModule } from './store.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(StoreModule);

  app.useGlobalPipes(new ValidationPipe());

  const configService: SixShopConfigService =
    app.get<SixShopConfigService>(SixShopConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        `${configService.rabbitmqProto}://${configService.rabbitmqUser}:${configService.rabbitmqPass}@${configService.rabbitmqHost}:${configService.rabbitmqPort}`,
      ],
      queue: STORE,
      noAck: true,
      queueOptions: {
        durable: true,
      },
    },
  });

  Logger.log(`${STORE} is running on [${configService.nodeEnv}]`);

  await app.startAllMicroservices();
}
bootstrap();
