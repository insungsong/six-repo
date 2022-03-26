import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AuthenticationModule } from './authentication.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SixShopConfigService } from 'libs/common/src/config/config.service';
import { AUTHENTICATION } from '@libs/common/constant/six-shop-app.name';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AuthenticationModule);

  app.useGlobalPipes(new ValidationPipe());

  const configService: SixShopConfigService =
    app.get<SixShopConfigService>(SixShopConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        `${configService.rabbitmqProto}://${configService.rabbitmqUser}:${configService.rabbitmqPass}@${configService.rabbitmqHost}:${configService.rabbitmqPort}`,
      ],
      queue: AUTHENTICATION,
      noAck: true,
      queueOptions: {
        durable: true,
      },
    },
  });

  Logger.log(`${AUTHENTICATION} is running on [${configService.nodeEnv}]`);

  await app.startAllMicroservices();
}
bootstrap();
