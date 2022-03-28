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
} from '@libs/common/dto';
import { FetchProductInput } from '@libs/common/dto/fetch-product.input';
import { RegisterProductInput } from '@libs/common/dto/register-product.input';
import { RegisterStoreInput } from '@libs/common/dto/register-store.input';
import {
  FetchMyOrderOutput,
  FetchMyStoreOutput,
  FetchMyStoresOutput,
  FetchProductOutput,
  Output,
} from '@libs/common/model';
import { FetchMyOrdersOutput } from '@libs/common/model/fetch-my-orders.output';
import { FetchProductsOutput } from '@libs/common/model/fetch-products.output';
import { TransactionBlock } from '@libs/common/transaction';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { StoreService } from './store.service';

@Controller()
export class StoreController {
  constructor(private readonly shopService: StoreService) {}

  @MessagePattern({ cmd: CMDType.REGSITER_STORE })
  async registerStore(input: RegisterStoreInput): Promise<Output> {
    return await TransactionBlock(
      input,
      async (input, entityManager): Promise<Output> => {
        return await this.shopService.registerStore(
          input as RegisterStoreInput,
          entityManager,
        );
      },
    );
  }

  @MessagePattern({ cmd: CMDType.UPDATE_STORE })
  async updateStore(input: UpdateStoreInput): Promise<Output> {
    return await TransactionBlock(
      input,
      async (input, entityManager): Promise<Output> => {
        return await this.shopService.updateStore(
          input as UpdateStoreInput,
          entityManager,
        );
      },
    );
  }

  @MessagePattern({ cmd: CMDType.DELETE_STORE })
  async deleteStore(input: DeleteStoreInput): Promise<Output> {
    return await TransactionBlock(
      input,
      async (input, entityManager): Promise<Output> => {
        return await this.shopService.deleteStore(
          input as DeleteStoreInput,
          entityManager,
        );
      },
    );
  }

  @MessagePattern({ cmd: CMDType.FETCH_MY_STORE })
  async fetchMyStore(input: FetchMyStoreInput): Promise<FetchMyStoreOutput> {
    return await this.shopService.fetchMyStore(input);
  }

  @MessagePattern({ cmd: CMDType.FETCH_PRODUCT })
  async fetchProduct(input: FetchProductInput): Promise<FetchProductOutput> {
    return await this.shopService.fetchProduct(input);
  }

  @MessagePattern({ cmd: CMDType.DELETE_PRODUCT })
  async deleteProduct(input: DeleteProductInput): Promise<Output> {
    return await TransactionBlock(
      input,
      async (input, entityManager): Promise<Output> => {
        return await this.shopService.deleteProduct(
          input as DeleteProductInput,
          entityManager,
        );
      },
    );
  }

  @MessagePattern({ cmd: CMDType.FETCH_PRODUCTS })
  async fetchProducts(input: FetchProductsInput): Promise<FetchProductsOutput> {
    return await this.shopService.fetchProducts(input);
  }

  @MessagePattern({ cmd: CMDType.FETCH_MY_ORDERS })
  async fetchMyOrders(input: FetchMyOrdersInput): Promise<FetchMyOrdersOutput> {
    return await this.shopService.fetchMyOrders(input);
  }

  @MessagePattern({ cmd: CMDType.FETCH_MY_ORDER })
  async fetchMyOrder(input: FetchMyOrderInput): Promise<FetchMyOrderOutput> {
    return await this.shopService.fetchMyOrder(input);
  }

  @MessagePattern({ cmd: CMDType.FETCH_MY_STORES })
  async fetchMyStores(input: FetchMyStoresInput): Promise<FetchMyStoresOutput> {
    return await this.shopService.fetchMyStores(input);
  }

  @MessagePattern({ cmd: CMDType.REGISTER_PRODUCT })
  async registerProduct(input: RegisterProductInput): Promise<Output> {
    return await TransactionBlock(
      input,
      async (input, entityManager): Promise<Output> => {
        return await this.shopService.registerProduct(
          input as RegisterProductInput,
          entityManager,
        );
      },
    );
  }

  @MessagePattern({ cmd: CMDType.UPDATE_PRODUCT })
  async updateProduct(input: UpdateProductInput): Promise<Output> {
    return await TransactionBlock(
      input,
      async (input, entityManager): Promise<Output> => {
        return await this.shopService.updateProduct(
          input as UpdateProductInput,
          entityManager,
        );
      },
    );
  }

  @MessagePattern({ cmd: CMDType.REGITER_ORDER })
  async registerOrder(input: RegisterOrderInput): Promise<Output> {
    return await TransactionBlock(
      input,
      async (input, entityManager): Promise<Output> => {
        return await this.shopService.registerOrder(
          input as RegisterOrderInput,
          entityManager,
        );
      },
    );
  }
}
