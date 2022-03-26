import { CMDType } from '@libs/common/constant';
import { UpdateShopInput } from '@libs/common/dto';
import { RegisterShopInput } from '@libs/common/dto/register-shop.input';
import { Output, SixShopException } from '@libs/common/model';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ShopProxyService {
  private logger = new Logger();

  constructor(@Inject('SHOP_SERVICE') private client: ClientProxy) {
    this.logger = new Logger('ShopProxyService');
  }

  async registerShop(input: RegisterShopInput): Promise<Output> {
    try {
      this.logger.debug(input);

      return await lastValueFrom(
        this.client.send<Output, RegisterShopInput>(
          { cmd: CMDType.REGSITER_SHOP },
          input,
        ),
      );
    } catch (error) {
      this.logger.error(error);
      throw SixShopException.processException(error);
    }
  }

  async updateShop(input: UpdateShopInput): Promise<Output> {
    try {
      this.logger.debug(input);

      return await lastValueFrom(
        this.client.send<Output, UpdateShopInput>(
          { cmd: CMDType.UPDATE_SHOP },
          input,
        ),
      );
    } catch (error) {
      this.logger.error(error);
      throw SixShopException.processException(error);
    }
  }
}
