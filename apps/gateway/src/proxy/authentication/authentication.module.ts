import { CommonModule } from '@libs/common';
import { HttpModule, Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { SixShopConfigService } from 'libs/common/src/config/config.service';
import { AuthenticationProxyService } from './authentication.proxy.service';
import { AUTHENTICATION } from '@libs/common/constant';
import { AuthenticationController } from './authentication.controller';

@Module({
  imports: [HttpModule, CommonModule],
  providers: [
    {
      provide: 'AUTHENTICATION_SERVICE',
      useFactory: (config: SixShopConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [
              `${config.rabbitmqProto}://${config.rabbitmqUser}:${config.rabbitmqPass}@${config.rabbitmqHost}:${config.rabbitmqPort}`,
            ],
            queue: AUTHENTICATION,
            noAck: true,
            queueOptions: {
              durable: true,
            },
          },
        }),
      inject: [SixShopConfigService],
    },
    AuthenticationProxyService,
    SixShopConfigService,
  ],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
