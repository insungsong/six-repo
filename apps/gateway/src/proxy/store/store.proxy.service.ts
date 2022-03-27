import { CMDType } from '@libs/common/constant';
import {
  FetchMyStoreInput,
  FetchMyStoresInput,
  UpdateProductInput,
  UpdateStoreInput,
} from '@libs/common/dto';
import { RegisterProductInput } from '@libs/common/dto/register-product.input';
import { RegisterStoreInput } from '@libs/common/dto/register-store.input';
import {
  FetchMyStoreOutput,
  FetchMyStoresOutput,
  Output,
  SixShopException,
} from '@libs/common/model';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class StoreProxyService {
  private logger = new Logger();

  constructor(@Inject('STORE_SERVICE') private client: ClientProxy) {
    this.logger = new Logger('ShopProxyService');
  }

  async registerStore(input: RegisterStoreInput): Promise<Output> {
    try {
      this.logger.debug(input);

      return await lastValueFrom(
        this.client.send<Output, RegisterStoreInput>(
          { cmd: CMDType.REGSITER_STORE },
          input,
        ),
      );
    } catch (error) {
      this.logger.error(error);
      throw SixShopException.processException(error);
    }
  }

  async updateStore(input: UpdateStoreInput): Promise<Output> {
    try {
      this.logger.debug(input);

      return await lastValueFrom(
        this.client.send<Output, UpdateStoreInput>(
          { cmd: CMDType.UPDATE_STORE },
          input,
        ),
      );
    } catch (error) {
      this.logger.error(error);
      throw SixShopException.processException(error);
    }
  }

  async fetchMyStore(input: FetchMyStoreInput): Promise<FetchMyStoreOutput> {
    try {
      this.logger.debug(input);

      return await lastValueFrom(
        this.client.send<Output, FetchMyStoreInput>(
          { cmd: CMDType.FETCH_MY_STORE },
          input,
        ),
      );
    } catch (error) {
      this.logger.error(error);
      throw SixShopException.processException(error);
    }
  }

  async fetchMyStores(input: FetchMyStoresInput): Promise<FetchMyStoresOutput> {
    try {
      this.logger.debug(input);

      return await lastValueFrom(
        this.client.send<Output, UpdateStoreInput>(
          { cmd: CMDType.FETCH_MY_STORES },
          input,
        ),
      );
    } catch (error) {
      this.logger.error(error);
      throw SixShopException.processException(error);
    }
  }

  async registerProduct(input: RegisterProductInput): Promise<Output> {
    try {
      return await lastValueFrom(
        this.client.send<Output, UpdateStoreInput>(
          { cmd: CMDType.REGISTER_PRODUCT },
          input,
        ),
      );
    } catch (error) {
      this.logger.error(error);
      throw SixShopException.processException(error);
    }
  }

  async updateProduct(input: UpdateProductInput): Promise<Output> {
    try {
      return await lastValueFrom(
        this.client.send<Output, UpdateStoreInput>(
          { cmd: CMDType.UPDATE_PRODUCT },
          input,
        ),
      );
    } catch (error) {
      this.logger.error(error);
      throw SixShopException.processException(error);
    }
  }
}
