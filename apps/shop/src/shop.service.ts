import { CustomType } from '@libs/common/constant';
import { SixShopErrorCode } from '@libs/common/constant/six-shop-error-code';
import { UpdateShopInput } from '@libs/common/dto';
import { RegisterShopInput } from '@libs/common/dto/register-shop.input';
import { Output, SixShopException } from '@libs/common/model';
import {
  AdditionalRequirementRepository,
  CustomerRepository,
  ShopRepository,
} from '@libs/database/respository';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class ShopService {
  async registerShop(
    input: RegisterShopInput,
    entityManageer: EntityManager,
  ): Promise<Output> {
    const userRepository =
      entityManageer.getCustomRepository<CustomerRepository>(
        CustomerRepository,
      );

    const user = await userRepository.findRegisteredUserByEmail(input.email);

    if (!user) {
      throw new SixShopException(SixShopErrorCode.USER_NOT_FOUND);
    }

    const shopRepository =
      entityManageer.getCustomRepository<ShopRepository>(ShopRepository);

    const isDuplicateShop = await shopRepository.findOne({
      name: input.name,
    });

    if (isDuplicateShop) {
      throw new SixShopException(SixShopErrorCode.DUPLICATE_NAME);
    }

    const additionalRequirementRepository =
      entityManageer.getCustomRepository<AdditionalRequirementRepository>(
        AdditionalRequirementRepository,
      );

    const shop = await entityManageer.save(
      shopRepository.create({
        name: input.name,
        customerId: user.id,
        custom: input.custom,
      }),
    );

    if (!shop) {
      throw new SixShopException(SixShopErrorCode.NOT_CREATE_SHOP);
    }

    Object.values(input.custom).filter((customData, index) => {
      if (customData === CustomType.ETC) {
        entityManageer.save(
          additionalRequirementRepository.create({
            customerId: user.id,
            shopId: shop.id,
            requirement: Object.keys(input.custom)[index],
          }),
        );
      }
    });

    return {
      result: SixShopErrorCode.SUCCESS,
    };
  }

  async updateShop(
    input: UpdateShopInput,
    entityManageer: EntityManager,
  ): Promise<Output> {
    const userRepository: CustomerRepository =
      entityManageer.getCustomRepository<CustomerRepository>(
        CustomerRepository,
      );

    const user = await userRepository.findRegisteredUserByEmail(input.email);

    if (!user) {
      throw new SixShopException(SixShopErrorCode.USER_NOT_FOUND);
    }

    const shopRepository =
      entityManageer.getCustomRepository<ShopRepository>(ShopRepository);

    const shop = await shopRepository.findOne({ id: input.shopId });

    if (shop.customerId !== user.id) {
      throw new SixShopException(SixShopErrorCode.NOT_MATCH_USER);
    }

    await shopRepository.update(
      {
        id: shop.id,
      },
      {
        name: input.name,
        custom: input.custom,
      },
    );

    const additionalRequirementRepository =
      entityManageer.getCustomRepository<AdditionalRequirementRepository>(
        AdditionalRequirementRepository,
      );

    Object.values(input.custom).filter((customData, index) => {
      if (customData === CustomType.ETC) {
        entityManageer.save(
          additionalRequirementRepository.create({
            customerId: user.id,
            shopId: shop.id,
            requirement: Object.keys(input.custom)[index],
          }),
        );
      }
    });

    return {
      result: SixShopErrorCode.SUCCESS,
    };
  }
}
