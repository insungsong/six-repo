import { CMDType } from '@libs/common/constant';
import { UpdateShopInput } from '@libs/common/dto';
import { RegisterShopInput } from '@libs/common/dto/register-shop.input';
import { Output } from '@libs/common/model';
import { TransactionBlock } from '@libs/common/transaction';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ShopService } from './shop.service';

@Controller()
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @MessagePattern({ cmd: CMDType.REGSITER_SHOP })
  async registerShop(input: RegisterShopInput): Promise<Output> {
    return await TransactionBlock(
      input,
      async (input, entityManager): Promise<Output> => {
        return await this.shopService.registerShop(
          input as RegisterShopInput,
          entityManager,
        );
      },
    );
  }

  @MessagePattern({ cmd: CMDType.UPDATE_SHOP })
  async UpdateShop(input: UpdateShopInput): Promise<Output> {
    return await TransactionBlock(
      input,
      async (input, entityManager): Promise<Output> => {
        return await this.shopService.updateShop(
          input as UpdateShopInput,
          entityManager,
        );
      },
    );
  }
}
