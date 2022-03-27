import { CommonModule } from '@libs/common';
import { STORE } from '@libs/common/constant/six-shop-app.name';
import { HttpModule, Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { SixShopConfigService } from 'libs/common/src/config/config.service';
import { StoreController } from './stroe.controller';
import { StoreProxyService } from './store.proxy.service';

@Module({
  imports: [HttpModule, CommonModule],
  providers: [
    {
      provide: 'STORE_SERVICE',
      useFactory: (config: SixShopConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [
              `${config.rabbitmqProto}://${config.rabbitmqUser}:${config.rabbitmqPass}@${config.rabbitmqHost}:${config.rabbitmqPort}`,
            ],
            queue: STORE,
            noAck: true,
            queueOptions: {
              durable: true,
            },
          },
        }),
      inject: [SixShopConfigService],
    },
    StoreProxyService,
    SixShopConfigService,
  ],
  controllers: [StoreController],
})
export class StroeModule {}
