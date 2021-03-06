import { CustomType } from '@libs/common/constant/custom.type';
import { SixShopErrorCode } from '@libs/common/constant/six-shop-error-code';
import { SixShopServiceType } from '@libs/common/constant/six-shop-service-type';
import {
  DeleteProductInput,
  DeleteStoreInput,
  FetchMyOrderInput,
  FetchMyOrdersInput,
  FetchMyStoreInput,
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
  FetchProductsOutput,
  Output,
  SixShopException,
  FetchMyOrdersOutput,
} from '@libs/common/model';

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser, ScopedAuth } from '../../decorator';
import { StoreProxyService } from './store.proxy.service';

@ApiTags('store')
@Controller('store')
export class StoreController {
  private readonly logger: Logger;
  constructor(private shopService: StoreProxyService) {
    this.logger = new Logger('Authentication');
  }

  async verifyCustomData(input: RegisterStoreInput): Promise<Output> {
    const customType = [
      CustomType.BOOK_ISSUE_DATE,
      CustomType.EXPIRATION_DATE,
      CustomType.PHONE_NUMBER,
      CustomType.GENDER,
      CustomType.DEVICE_TYPE,
      CustomType.RESERVES,
      CustomType.ETC,
    ];

    const verifyCustomDataKeys = Object.values(input.custom);

    // if (Object.keys(input.custom).length < 1) {
    //   throw new SixShopException(
    //     SixShopErrorCode.IT_EXISTS_BUT_HAS_NO_CUSTOM_VALUE,
    //   );
    // }

    verifyCustomDataKeys.map((value) => {
      if (!customType.includes(value)) {
        throw new SixShopException(SixShopErrorCode.NOT_FOUND_CUSTOM_TYPE);
      }
    });

    return {
      result: SixShopErrorCode.SUCCESS,
    };
  }

  @ApiOperation({
    summary: '?????? ?????? api',
  })
  @ApiResponse({ type: () => Output })
  @ScopedAuth([SixShopServiceType.USER])
  @ApiBearerAuth('Authorization')
  @Post('/registerStore')
  @ApiBody({
    type: RegisterStoreInput,
  })
  async registerStore(
    @CurrentUser() user: any,
    @Body() input: RegisterStoreInput,
  ) {
    try {
      this.logger.debug(input);

      // const customType = [
      //   CustomType.BOOK_ISSUE_DATE,
      //   CustomType.EXPIRATION_DATE,
      //   CustomType.PHONE_NUMBER,
      //   CustomType.GENDER,
      //   CustomType.DEVICE_TYPE,
      //   CustomType.RESERVES,
      //   CustomType.ETC,
      // ];

      // if (input.custom) {
      //   const verifyCustomDataKeys = Object.values(input.custom);

      //   if (Object.keys(input.custom).length < 1) {
      //     throw new SixShopException(
      //       SixShopErrorCode.IT_EXISTS_BUT_HAS_NO_CUSTOM_VALUE,
      //     );
      //   }
      //   verifyCustomDataKeys.map((value) => {
      //     if (!customType.includes(value)) {
      //       throw new SixShopException(SixShopErrorCode.NOT_FOUND_CUSTOM_TYPE);
      //     }
      //   });
      // }

      if (input.custom) {
        const result = await this.verifyCustomData(input);

        if (result.result === SixShopErrorCode.SUCCESS) {
          return await this.shopService.registerStore({
            email: user.email,
            ...input,
          });
        }
      }

      return await this.shopService.registerStore({
        email: user.email,
        ...input,
      });
    } catch (error) {
      this.logger.error(error);
      return {
        result: error.response,
      };
    }
  }

  @ApiOperation({
    summary: '?????? ?????? api',
  })
  @ApiResponse({ type: () => Output })
  @ScopedAuth([SixShopServiceType.USER])
  @ApiBearerAuth('Authorization')
  @Post('/updateStore')
  @ApiBody({
    type: UpdateStoreInput,
  })
  async updateStore(
    @CurrentUser() user: any,
    @Body() input: UpdateStoreInput,
  ): Promise<Output> {
    try {
      if (input.custom) {
        const result = await this.verifyCustomData(input);

        if (result.result === SixShopErrorCode.SUCCESS) {
          return await this.shopService.updateStore({
            email: user.email,
            ...input,
          });
        }
      }

      return await this.shopService.updateStore({
        email: user.email,
        ...input,
      });
    } catch (error) {
      this.logger.error(error);
      return {
        result: error.response,
      };
    }
  }

  @ApiOperation({
    summary: '?????? ?????? api',
  })
  @ApiResponse({ type: () => Output })
  @ScopedAuth([SixShopServiceType.USER])
  @ApiBearerAuth('Authorization')
  @Delete('/deleteStore/:storeId')
  async deleteStore(
    @CurrentUser() user: any,
    @Param('storeId') storeId: string,
  ): Promise<Output> {
    try {
      const input: DeleteStoreInput = {
        email: user.email,
        storeId: storeId,
      };

      return await this.shopService.deleteStore({
        ...input,
      });
    } catch (error) {
      this.logger.error(error);
      return {
        result: error.response,
      };
    }
  }

  @ApiOperation({
    summary: '?????? ?????? fetch query api',
  })
  @ApiResponse({ type: () => FetchMyStoreOutput })
  @ScopedAuth([SixShopServiceType.USER])
  @ApiBearerAuth('Authorization')
  @Get('/myStore/:storeId')
  async fetchMyStore(
    @CurrentUser() user: any,
    @Param('storeId', new ParseUUIDPipe({ version: '4' })) storeId: string,
  ): Promise<FetchMyStoreOutput> {
    try {
      const input: FetchMyStoreInput = {
        email: user.email,
        storeId: storeId,
      };

      return await this.shopService.fetchMyStore({
        email: user.email,
        ...input,
      });
    } catch (error) {
      this.logger.error(error.message);

      throw new SixShopException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({
    summary: '????????? ?????? ?????? api',
  })
  @ApiResponse({ type: () => Output })
  @ScopedAuth([SixShopServiceType.USER])
  @ApiBearerAuth('Authorization')
  @Delete('/deleteProduct/:productId')
  async deleteProduct(
    @CurrentUser() user: any,
    @Param('productId') productId: string,
  ): Promise<Output> {
    try {
      const input: DeleteProductInput = {
        email: user.email,
        productId: productId,
      };

      return await this.shopService.deleteProduct({
        ...input,
      });
    } catch (error) {
      this.logger.error(error);
      return {
        result: error.response,
      };
    }
  }

  @ApiOperation({
    summary: '???????????? ???????????? ????????? list query api',
  })
  @ApiResponse({ type: () => FetchProductsOutput })
  @ScopedAuth([SixShopServiceType.USER])
  @ApiBearerAuth('Authorization')
  @Get('/:storeId/products')
  async fetchProducts(
    @CurrentUser() user: any,
    @Param('storeId', new ParseUUIDPipe({ version: '4' })) storeId: string,
  ): Promise<FetchProductsOutput> {
    try {
      const input: FetchProductsInput = {
        email: user.email,
        storeId: storeId,
      };
      return await this.shopService.fetchProducts({
        ...input,
      });
    } catch (error) {
      this.logger.error(error.message);

      throw new SixShopException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({
    summary: '???????????? ????????? ?????? ?????? ?????? list query api',
  })
  @ApiResponse({ type: () => FetchMyOrdersOutput })
  @ScopedAuth([SixShopServiceType.USER])
  @ApiBearerAuth('Authorization')
  @Get('/:storeId/fetchMyOrder')
  async fetchMyOrders(
    @CurrentUser() user: any,
    @Param('storeId', new ParseUUIDPipe({ version: '4' })) storeId: string,
  ): Promise<FetchMyOrdersOutput> {
    const input: FetchMyOrdersInput = {
      email: user.email,
      storeId: storeId,
    };
    try {
      return await this.shopService.fetchMyOrders({
        ...input,
      });
    } catch (error) {
      this.logger.error(error);

      return {
        result: error.result,
      };
    }
  }

  @ApiOperation({
    summary: '???????????? ????????? ?????? Detail query api',
  })
  @ApiResponse({ type: () => FetchMyOrderOutput })
  @ScopedAuth([SixShopServiceType.USER])
  @ApiBearerAuth('Authorization')
  @Get('/:storeId/:orderId')
  async fetchMyOrder(
    @CurrentUser() user: any,
    @Param('storeId', new ParseUUIDPipe({ version: '4' })) storeId: string,
    @Param('orderId', new ParseUUIDPipe({ version: '4' })) orderId: string,
  ): Promise<FetchMyOrderOutput> {
    const input: FetchMyOrderInput = {
      email: user.email,
      storeId: storeId,
      orderId: orderId,
    };
    try {
      return await this.shopService.fetchMyOrder({
        ...input,
      });
    } catch (error) {
      this.logger.error(error);

      return {
        result: error.result,
      };
    }
  }

  @ApiOperation({
    summary: '???????????? ???????????? ?????? query api',
  })
  @ApiResponse({ type: () => FetchProductOutput })
  @ScopedAuth([SixShopServiceType.USER])
  @ApiBearerAuth('Authorization')
  @Get('/:storeId/:productId')
  async fetchProduct(
    @CurrentUser() user: any,
    @Param('storeId', new ParseUUIDPipe({ version: '4' })) storeId: string,
    @Param('productId', new ParseUUIDPipe({ version: '4' })) productId: string,
  ): Promise<FetchProductOutput> {
    try {
      const input: FetchProductInput = {
        email: user.email,
        storeId: storeId,
        productId: productId,
      };
      return await this.shopService.fetchProduct({
        ...input,
      });
    } catch (error) {
      this.logger.error(error.message);

      throw new SixShopException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({
    summary: '?????? sixshop?????? ????????? ?????? list query api',
  })
  @ApiResponse({ type: () => FetchMyStoresOutput })
  @ScopedAuth([SixShopServiceType.USER])
  @ApiBearerAuth('Authorization')
  @Get('/fetchMyStores')
  async fetchMyStores(@CurrentUser() user: any): Promise<FetchMyStoresOutput> {
    try {
      return await this.shopService.fetchMyStores({
        email: user.email,
      });
    } catch (error) {
      this.logger.error(error.message);

      throw new SixShopException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({
    summary: '?????? ?????? api',
  })
  @ApiResponse({ type: () => Output })
  @ScopedAuth([SixShopServiceType.USER])
  @ApiBearerAuth('Authorization')
  @Post('/registerProduct')
  @ApiBody({
    type: RegisterProductInput,
  })
  async registerProduct(
    @CurrentUser() user: any,
    @Body() input: RegisterProductInput,
  ): Promise<Output> {
    try {
      return await this.shopService.registerProduct({
        email: user.email,
        ...input,
      });
    } catch (error) {
      this.logger.error(error);
      return {
        result: error.response,
      };
    }
  }

  @ApiOperation({
    summary: '?????? ?????? api',
  })
  @ApiResponse({ type: () => Output })
  @ScopedAuth([SixShopServiceType.USER])
  @ApiBearerAuth('Authorization')
  @Post('/updateProduct')
  @ApiBody({
    type: UpdateProductInput,
  })
  async updateProduct(
    @CurrentUser() user: any,
    @Body() input: UpdateProductInput,
  ): Promise<Output> {
    try {
      return await this.shopService.updateProduct({
        email: user.email,
        ...input,
      });
    } catch (error) {
      this.logger.error(error);
      return {
        result: error.response,
      };
    }
  }

  @ApiOperation({
    summary: '?????? ?????? api',
  })
  @ApiResponse({ type: () => Output })
  @ScopedAuth([SixShopServiceType.USER])
  @ApiBearerAuth('Authorization')
  @Post('/registerOrder')
  @ApiBody({
    type: RegisterOrderInput,
  })
  async registerOrder(
    @CurrentUser() user: any,
    @Body() input: RegisterOrderInput,
  ): Promise<Output> {
    try {
      return await this.shopService.registerOrder({
        email: user.email,
        ...input,
      });
    } catch (error) {
      this.logger.error(error);
      return {
        result: error.response,
      };
    }
  }
}
