import { CMDType } from '@libs/common/constant';
import {
  DeleteProductInput,
  DeleteStoreInput,
  FetchMyOrderInput,
  FetchMyOrdersInput,
  FetchMyStoreInput,
  FetchMyStoresInput,
  FetchProductsInput,
  RegisterOrderInput,
  UpdateProductInput,
  UpdateStoreInput,
  FetchProductInput,
  RegisterProductInput,
  RegisterStoreInput,
} from '@libs/common/dto';

import {
  FetchMyOrderOutput,
  FetchMyStoreOutput,
  FetchMyStoresOutput,
  FetchProductOutput,
  FetchMyOrdersOutput,
  FetchProductsOutput,
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

  async deleteStore(input: DeleteStoreInput): Promise<Output> {
    try {
      return await lastValueFrom(
        this.client.send<Output, DeleteStoreInput>(
          { cmd: CMDType.DELETE_STORE },
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

  async deleteProduct(input: DeleteProductInput): Promise<Output> {
    try {
      this.logger.debug(input);

      return await lastValueFrom(
        this.client.send<Output, FetchMyStoreInput>(
          { cmd: CMDType.DELETE_PRODUCT },
          input,
        ),
      );
    } catch (error) {
      this.logger.error(error);
      throw SixShopException.processException(error);
    }
  }

  async fetchProduct(input: FetchProductInput): Promise<FetchProductOutput> {
    try {
      this.logger.debug(input);

      return await lastValueFrom(
        this.client.send<FetchProductOutput, FetchMyStoreInput>(
          { cmd: CMDType.FETCH_PRODUCT },
          input,
        ),
      );
    } catch (error) {
      this.logger.error(error);
      throw SixShopException.processException(error);
    }
  }

  async fetchProducts(input: FetchProductsInput): Promise<FetchProductsOutput> {
    try {
      this.logger.debug(input);

      return await lastValueFrom(
        this.client.send<FetchProductsOutput, FetchProductsInput>(
          { cmd: CMDType.FETCH_PRODUCTS },
          input,
        ),
      );
    } catch (error) {
      this.logger.error(error);
      throw SixShopException.processException(error);
    }
  }

  async fetchMyOrders(input: FetchMyOrdersInput): Promise<FetchMyOrdersOutput> {
    try {
      this.logger.debug(input);

      return await lastValueFrom(
        this.client.send<FetchMyOrdersOutput, FetchMyOrdersInput>(
          { cmd: CMDType.FETCH_MY_ORDERS },
          input,
        ),
      );
    } catch (error) {
      this.logger.error(error);
      throw SixShopException.processException(error);
    }
  }

  async fetchMyOrder(input: FetchMyOrderInput): Promise<FetchMyOrderOutput> {
    try {
      this.logger.debug(input);

      return await lastValueFrom(
        this.client.send<FetchMyOrdersOutput, FetchMyOrdersInput>(
          { cmd: CMDType.FETCH_MY_ORDERS },
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

  async registerOrder(input: RegisterOrderInput): Promise<Output> {
    try {
      return await lastValueFrom(
        this.client.send<Output, UpdateStoreInput>(
          { cmd: CMDType.REGITER_ORDER },
          input,
        ),
      );
    } catch (error) {
      this.logger.error(error);
      throw SixShopException.processException(error);
    }
  }
}
