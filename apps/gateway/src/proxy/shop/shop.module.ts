import { CommonModule } from '@libs/common';
import { SHOP } from '@libs/common/constant/six-shop-app.name';
import { HttpModule, Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { SixShopConfigService } from 'libs/common/src/config/config.service';
import { ShopController } from './shop.controller';
import { ShopProxyService } from './shop.proxy.service';

@Module({
  imports: [HttpModule, CommonModule],
  providers: [
    {
      provide: 'SHOP_SERVICE',
      useFactory: (config: SixShopConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [
              `${config.rabbitmqProto}://${config.rabbitmqUser}:${config.rabbitmqPass}@${config.rabbitmqHost}:${config.rabbitmqPort}`,
            ],
            queue: SHOP,
            noAck: true,
            queueOptions: {
              durable: true,
            },
          },
        }),
      inject: [SixShopConfigService],
    },
    ShopProxyService,
    SixShopConfigService,
  ],
  controllers: [ShopController],
})
export class ShopModule {}
