import { CustomType, StroeStatus } from '@libs/common/constant';
import { SixShopErrorCode } from '@libs/common/constant/six-shop-error-code';
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
import {
  AdditionalRequirementRepository,
  CustomerRepository,
  ProductRepository,
  StoreRepository,
} from '@libs/database/respository';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class StoreService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly storeRepository: StoreRepository,
  ) {}

  async registerStore(
    input: RegisterStoreInput,
    entityManager: EntityManager,
  ): Promise<Output> {
    const userRepository =
      entityManager.getCustomRepository<CustomerRepository>(CustomerRepository);

    const user = await userRepository.findRegisteredUserByEmail(input.email);

    if (!user) {
      throw new SixShopException(SixShopErrorCode.USER_NOT_FOUND);
    }

    const storeRepository =
      entityManager.getCustomRepository<StoreRepository>(StoreRepository);

    const isDuplicateShop = await storeRepository.findOne({
      name: input.name,
    });

    if (isDuplicateShop) {
      throw new SixShopException(SixShopErrorCode.DUPLICATE_NAME);
    }

    const additionalRequirementRepository =
      entityManager.getCustomRepository<AdditionalRequirementRepository>(
        AdditionalRequirementRepository,
      );

    const store = await entityManager.save(
      storeRepository.create({
        name: input.name,
        customerId: user.id,
        custom: input.custom,
        status: StroeStatus.AVAILABLE,
      }),
    );

    if (!store) {
      throw new SixShopException(SixShopErrorCode.NOT_CREATE_SHOP);
    }

    Object.values(input.custom).filter((customData, index) => {
      if (customData === CustomType.ETC) {
        entityManager.save(
          additionalRequirementRepository.create({
            customerId: user.id,
            storeId: store.id,
            requirement: Object.keys(input.custom)[index],
          }),
        );
      }
    });

    return {
      result: SixShopErrorCode.SUCCESS,
    };
  }

  async updateStore(
    input: UpdateStoreInput,
    entityManager: EntityManager,
  ): Promise<Output> {
    const userRepository: CustomerRepository =
      entityManager.getCustomRepository<CustomerRepository>(CustomerRepository);

    const user = await userRepository.findRegisteredUserByEmail(input.email);

    if (!user) {
      throw new SixShopException(SixShopErrorCode.USER_NOT_FOUND);
    }

    const storeRepository =
      entityManager.getCustomRepository<StoreRepository>(StoreRepository);

    const store = await storeRepository.findOne({ id: input.storeId });

    if (!store) {
      throw new SixShopException(SixShopErrorCode.NOT_FOUND_SHOP);
    }

    if (store.customerId !== user.id) {
      throw new SixShopException(SixShopErrorCode.NOT_MATCH_USER);
    }

    await storeRepository.update(
      {
        id: store.id,
      },
      {
        name: input.name,
        custom: input.custom,
      },
    );

    const additionalRequirementRepository =
      entityManager.getCustomRepository<AdditionalRequirementRepository>(
        AdditionalRequirementRepository,
      );

    Object.values(input.custom).filter((customData, index) => {
      if (customData === CustomType.ETC) {
        entityManager.save(
          additionalRequirementRepository.create({
            customerId: user.id,
            storeId: store.id,
            requirement: Object.keys(input.custom)[index],
          }),
        );
      }
    });

    return {
      result: SixShopErrorCode.SUCCESS,
    };
  }

  async fetchMyStore(input: FetchMyStoreInput): Promise<FetchMyStoreOutput> {
    const user = await this.customerRepository.findRegisteredUserByEmail(
      input.email,
    );

    if (!user) {
      throw new SixShopException(SixShopErrorCode.USER_NOT_FOUND);
    }

    const store = await this.storeRepository.findOne({
      id: input.storeId,
      customerId: user.id,
    });

    if (!store) {
      throw new SixShopException(SixShopErrorCode.NOT_FOUND_MY_SHOP);
    }

    return {
      result: SixShopErrorCode.SUCCESS,
      data: {
        ...store,
      },
    };
  }

  async fetchMyStores(input: FetchMyStoresInput): Promise<FetchMyStoresOutput> {
    const user = await this.customerRepository.findRegisteredUserByEmail(
      input.email,
    );

    if (!user) {
      throw new SixShopException(SixShopErrorCode.USER_NOT_FOUND);
    }

    const myStores = await this.storeRepository.find({ customerId: user.id });

    return {
      result: SixShopErrorCode.SUCCESS,
      data: [...myStores],
    };
  }

  async registerProduct(
    input: RegisterProductInput,
    entityManager: EntityManager,
  ): Promise<Output> {
    const userRepository =
      entityManager.getCustomRepository<CustomerRepository>(CustomerRepository);

    const user = await userRepository.findRegisteredUserByEmail(input.email);

    if (!user) {
      throw new SixShopException(SixShopErrorCode.USER_NOT_FOUND);
    }

    const storeRepository =
      entityManager.getCustomRepository<StoreRepository>(StoreRepository);

    const store = await storeRepository.findOne({
      id: input.storeId,
      customerId: user.id,
    });

    if (!store) {
      throw new SixShopException(SixShopErrorCode.NOT_FOUND_SHOP);
    }

    const productRepository =
      entityManager.getCustomRepository<ProductRepository>(ProductRepository);

    await entityManager.save(
      productRepository.create({
        name: input.name,
        price: input.price,
        storeId: store.id,
        customerId: user.id,
        categories: input.categories,
      }),
    );

    return {
      result: SixShopErrorCode.SUCCESS,
    };
  }

  async updateProduct(
    input: UpdateProductInput,
    entityManager: EntityManager,
  ): Promise<Output> {
    const userRepository =
      entityManager.getCustomRepository<CustomerRepository>(CustomerRepository);

    const user = await userRepository.findRegisteredUserByEmail(input.email);

    if (!user) {
      throw new SixShopException(SixShopErrorCode.USER_NOT_FOUND);
    }

    const productRepository =
      entityManager.getCustomRepository<ProductRepository>(ProductRepository);

    const product = await productRepository.findOne({
      id: input.productId,
    });

    if (!product) {
      throw new SixShopException(SixShopErrorCode.NOT_FOUND_PRODUCT);
    }

    if (product.customerId !== user.id) {
      throw new SixShopException(SixShopErrorCode.NOT_MATCH_USER);
    }

    await productRepository.update(
      { id: product.id },
      {
        name: input.name,
        price: input.price,
        categories: input.categories,
      },
    );

    return {
      result: SixShopErrorCode.SUCCESS,
    };
  }
}
