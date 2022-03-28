import {
  CustomType,
  OrderStatus,
  ProductStatus,
  StroeStatus,
} from '@libs/common/constant';
import { SixShopErrorCode } from '@libs/common/constant/six-shop-error-code';
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
  SixShopException,
} from '@libs/common/model';
import { FetchMyOrdersOutput } from '@libs/common/model/fetch-my-orders.output';
import { FetchProductsOutput } from '@libs/common/model/fetch-products.output';
import {
  AdditionalRequirementRepository,
  CustomerRepository,
  OrderRepository,
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
    private readonly productRepository: ProductRepository,
    private readonly orderRepository: OrderRepository,
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
      throw new SixShopException(SixShopErrorCode.NOT_CREATE_STORE);
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
      throw new SixShopException(SixShopErrorCode.NOT_FOUND_STORE);
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

  async deleteStore(
    input: DeleteStoreInput,
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

    const store = await storeRepository.findOne({ id: input.storeId });

    //TO DO : 상점을 생성한 사람인지?
    if (store.customerId != user.id) {
      throw new SixShopException(SixShopErrorCode.NOT_MATCH_USER);
    }

    const productRepository =
      entityManager.getCustomRepository<ProductRepository>(ProductRepository);

    const products = await productRepository.find({ storeId: store.id });

    //TO DO : 상점이 생성될때 만들어진 Product를 다 DELETE 처리 해야한다.
    await Promise.all(
      products.map(async (product) => {
        await productRepository.update(
          { id: product.id },
          { status: ProductStatus.DELETED },
        );
      }),
    );

    //TO DO : 상점이 DELETE 처리 되어야한다.
    await storeRepository.update(
      { id: store.id },
      { status: StroeStatus.DELETED },
    );

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

    // const store = await this.storeRepository.findOne({
    //   id: input.storeId,
    //   customerId: user.id,
    // });

    const store = await this.storeRepository.query(
      `
      select * from store s
      where s.id = '${input.storeId}'
      and s.customer_id = '${user.id}'
      and s.status = '${StroeStatus.AVAILABLE}';
      `,
      [],
    );

    if (!store) {
      throw new SixShopException(SixShopErrorCode.NOT_FOUND_MY_STORE);
    }

    return {
      result: SixShopErrorCode.SUCCESS,
      data: {
        ...store[0],
      },
    };
  }

  async fetchProduct(input: FetchProductInput): Promise<FetchProductOutput> {
    const user = await this.customerRepository.findRegisteredUserByEmail(
      input.email,
    );

    if (!user) {
      throw new SixShopException(SixShopErrorCode.USER_NOT_FOUND);
    }

    const store = await this.storeRepository.findOne({ id: input.storeId });

    if (!store) {
      throw new SixShopException(SixShopErrorCode.NOT_FOUND_STORE);
    }

    const product = await this.productRepository.findOne({
      id: input.productId,
      storeId: store.id,
    });

    if (!product) {
      throw new SixShopException(SixShopErrorCode.NOT_FOUND_PRODUCT);
    }

    return {
      result: SixShopErrorCode.SUCCESS,
      data: product,
    };
  }

  async fetchProducts(input: FetchProductsInput): Promise<FetchProductsOutput> {
    const user = await this.customerRepository.findRegisteredUserByEmail(
      input.email,
    );

    if (!user) {
      throw new SixShopException(SixShopErrorCode.USER_NOT_FOUND);
    }

    //TO DO
    //해당 store가 존재하는 store인지
    //해당 store와 엮어진 product만 가져오면서, 삭제되지 않은 상품
    const store = await this.storeRepository.findOne({ id: input.storeId });

    if (!store) {
      throw new SixShopException(SixShopErrorCode.NOT_FOUND_STORE);
    }

    const products = await this.productRepository.query(
      `
      select * from product p 
      where p.store_id = '${store.id}'
      and p.status = '${ProductStatus.AVAILABLE}'
      `,
      [],
    );

    return {
      result: SixShopErrorCode.SUCCESS,
      data: [...products],
    };
  }

  async fetchMyOrders(input: FetchMyOrdersInput): Promise<FetchMyOrdersOutput> {
    const user = await this.customerRepository.findRegisteredUserByEmail(
      input.email,
    );

    if (!user) {
      throw new SixShopException(SixShopErrorCode.USER_NOT_FOUND);
    }

    const store = await this.storeRepository.findOne({ id: input.storeId });

    if (!store) {
      throw new SixShopException(SixShopErrorCode.NOT_FOUND_STORE);
    }

    if (store.customerId !== user.id) {
      throw new SixShopException(SixShopErrorCode.NOT_MATCH_USER);
    }

    const orders = await this.orderRepository.query(
      `
      select 
      	distinct 
      	o.id as "orderNumber",
      	c.name as "customerName",
      	o.created_at as "createdAt",
      	p.name as "productName",
      	p.price as "productPrice",
      	o.status as "orderStatus"
      from "order" o
      inner join customer c on c.id = o.customer_id
      left outer join store s on s.customer_id = c.id 
      inner join product p on p.store_id = '${store.id}'
      where o.customer_id = '${user.id}'
      order by o.created_at;
      `,
      [],
    );

    return {
      result: SixShopErrorCode.SUCCESS,
      data: [...orders],
    };
  }

  async fetchMyOrder(input: FetchMyOrderInput): Promise<FetchMyOrderOutput> {
    const user = await this.customerRepository.findRegisteredUserByEmail(
      input.email,
    );

    if (!user) {
      throw new SixShopException(SixShopErrorCode.USER_NOT_FOUND);
    }

    const store = await this.storeRepository.findOne({ id: input.storeId });

    if (!store) {
      throw new SixShopException(SixShopErrorCode.NOT_FOUND_STORE);
    }

    if (store.customerId !== user.id) {
      throw new SixShopException(SixShopErrorCode.NOT_MATCH_USER);
    }

    const order = await this.orderRepository.findOne({ id: input.orderId });

    if (!order) {
      throw new SixShopException(SixShopErrorCode.NOT_FOUND_ORDER);
    }

    const data = await this.orderRepository.query(
      `
      select 
      	distinct 
      	o.id as "orderNumber",
      	c.name as "customerName",
      	o.created_at as "createdAt",
      	p.name as "productName",
      	p.price as "productPrice",
      	o.status as "orderStatus"
      from "order" o
      inner join customer c on c.id = o.customer_id
      left outer join store s on s.customer_id = c.id 
      inner join product p on p.store_id = '${store.id}'
      where o.customer_id = '${user.id}'
      and o.id = '${order.id}';
      `,
      [],
    );

    return {
      result: SixShopErrorCode.SUCCESS,
      data: data[0],
    };
  }

  async deleteProduct(
    input: DeleteProductInput,
    entityManageer: EntityManager,
  ): Promise<Output> {
    //TO DO
    //1.유저가 존재하는 지 확인
    const userRepository =
      entityManageer.getCustomRepository<CustomerRepository>(
        CustomerRepository,
      );

    const user = await userRepository.findRegisteredUserByEmail(input.email);

    if (!user) {
      throw new SixShopException(SixShopErrorCode.USER_NOT_FOUND);
    }

    //2.유저가 store를 생성한 사람인지 확인
    const productRepository =
      entityManageer.getCustomRepository<ProductRepository>(ProductRepository);

    const product = await productRepository.findOne({ id: input.productId });

    const storeRepository =
      entityManageer.getCustomRepository<StoreRepository>(StoreRepository);

    const store = await storeRepository.findOne({ id: product.storeId });

    if (store.customerId != user.id) {
      throw new SixShopException(SixShopErrorCode.NOT_MATCH_USER);
    }

    //3.store를 생성한 사람이라면, 삭제 할 수 있도록
    await productRepository.update(
      {
        id: product.id,
      },
      { status: ProductStatus.DELETED },
    );

    return {
      result: SixShopErrorCode.SUCCESS,
    };
  }

  async fetchMyStores(input: FetchMyStoresInput): Promise<FetchMyStoresOutput> {
    const user = await this.customerRepository.findRegisteredUserByEmail(
      input.email,
    );

    if (!user) {
      throw new SixShopException(SixShopErrorCode.USER_NOT_FOUND);
    }

    // const myStores = await this.storeRepository.find({ customerId: user.id });

    const myStores = await this.storeRepository.query(
      `
      select * from store s
      where s.customer_id = '${user.id}'
      and s.status = '${StroeStatus.AVAILABLE}';
      `,
      [],
    );

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
      throw new SixShopException(SixShopErrorCode.NOT_FOUND_STORE);
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
        status: ProductStatus.AVAILABLE,
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

  async registerOrder(
    input: RegisterOrderInput,
    entityManager: EntityManager,
  ): Promise<Output> {
    //TO DO
    //1.해당 유저가 존재하는지 확인 하고 확인 후
    const userRepository =
      entityManager.getCustomRepository<CustomerRepository>(CustomerRepository);

    const user = await userRepository.findRegisteredUserByEmail(input.email);

    if (!user) {
      throw new SixShopException(SixShopErrorCode.USER_NOT_FOUND);
    }

    const storeRepository =
      entityManager.getCustomRepository<StoreRepository>(StoreRepository);

    const store = await storeRepository.findOne({ id: input.storeId });

    if (!store) {
      throw new SixShopException(SixShopErrorCode.NOT_FOUND_STORE);
    }

    const productRepository =
      entityManager.getCustomRepository<ProductRepository>(ProductRepository);

    const product = await productRepository.findOne({ id: input.productId });

    if (!product) {
      throw new SixShopException(SixShopErrorCode.NOT_FOUND_PRODUCT);
    }

    //2.해당 유저 이름으로 order를 신청한다.
    const orderRepository =
      entityManager.getCustomRepository<OrderRepository>(OrderRepository);

    await entityManager.save(
      orderRepository.create({
        storeId: input.storeId,
        productId: input.productId,
        customerId: user.id,
        status: OrderStatus.BEFORE_DEPOSIT,
        confirmPayment: false,
      }),
    );

    return {
      result: SixShopErrorCode.SUCCESS,
    };
  }
}
