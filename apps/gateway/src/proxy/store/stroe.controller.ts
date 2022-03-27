import { CustomType } from '@libs/common/constant/custom.type';
import { SixShopErrorCode } from '@libs/common/constant/six-shop-error-code';
import { SixShopServiceType } from '@libs/common/constant/six-shop-service-type';
import {
  DeleteStoreInput,
  FetchMyStoreInput,
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
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
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
    summary: '상점 등록 api',
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
    summary: '상점 수정 api',
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
    summary: '상점 삭제 api',
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
    summary: '나의 상점 fetch query api',
  })
  @ApiResponse({ type: () => FetchMyStoreOutput })
  @ScopedAuth([SixShopServiceType.USER])
  @ApiBearerAuth('Authorization')
  @Get('/myShop/:storeId')
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
    summary: '내가 sixshop에서 생성한 상점 list query api',
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
    summary: '상품 등록 api',
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
    summary: '상품 수정 api',
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
}
