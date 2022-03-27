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
} from '@libs/common/model';
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

  @MessagePattern({ cmd: CMDType.FETCH_MY_STORE })
  async fetchMyStore(input: FetchMyStoreInput): Promise<FetchMyStoreOutput> {
    return await this.shopService.fetchMyStore(input);
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
}
