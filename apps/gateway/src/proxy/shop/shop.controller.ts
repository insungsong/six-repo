import { CustomType } from '@libs/common/constant/custom.type';
import { SixShopErrorCode } from '@libs/common/constant/six-shop-error-code';
import { SixShopServiceType } from '@libs/common/constant/six-shop-service-type';
import {
  FetchMyShopInput,
  FetchMyShopsInput,
  UpdateShopInput,
} from '@libs/common/dto';
import { RegisterShopInput } from '@libs/common/dto/register-shop.input';
import {
  FetchMyShopOutput,
  FetchMyShopsOutput,
  Output,
  SixShopException,
} from '@libs/common/model';
import {
  Body,
  Controller,
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
import { ShopProxyService } from './shop.proxy.service';
import { Response } from 'express';

@ApiTags('shop')
@Controller('shop')
export class ShopController {
  private readonly logger: Logger;
  constructor(private shopService: ShopProxyService) {
    this.logger = new Logger('Authentication');
  }

  async verifyCustomData(input: RegisterShopInput): Promise<Output> {
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
  @Post('/registerShop')
  @ApiBody({
    type: RegisterShopInput,
  })
  async registerShop(
    @CurrentUser() user: any,
    @Body() input: RegisterShopInput,
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
          return await this.shopService.registerShop({
            email: user.email,
            ...input,
          });
        }
      }

      return await this.shopService.registerShop({
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
  @Post('/updateShop')
  @ApiBody({
    type: UpdateShopInput,
  })
  async updateShop(
    @CurrentUser() user: any,
    @Body() input: UpdateShopInput,
  ): Promise<Output> {
    try {
      if (input.custom) {
        const result = await this.verifyCustomData(input);

        if (result.result === SixShopErrorCode.SUCCESS) {
          return await this.shopService.updateShop({
            email: user.email,
            ...input,
          });
        }
      }

      return await this.shopService.updateShop({
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
    summary: '나의 상점 fetch query api',
  })
  @ApiResponse({ type: () => FetchMyShopOutput })
  @ScopedAuth([SixShopServiceType.USER])
  @ApiBearerAuth('Authorization')
  @Get('/myShop/:shopId')
  async fetchMyShop(
    @CurrentUser() user: any,
    @Param('shopId', new ParseUUIDPipe({ version: '4' })) shopId: string,
  ): Promise<FetchMyShopOutput> {
    try {
      const input: FetchMyShopInput = {
        email: user.email,
        shopId: shopId,
      };

      return await this.shopService.fetchMyShop({
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
  @ApiResponse({ type: () => FetchMyShopsOutput })
  @ScopedAuth([SixShopServiceType.USER])
  @ApiBearerAuth('Authorization')
  @Get('/fetchMyShops')
  async fetchMyShops(@CurrentUser() user: any): Promise<FetchMyShopsOutput> {
    try {
      return await this.shopService.fetchMyShops({
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
  @Post('/updateShop')
  @ApiBody({
    type: UpdateShopInput,
  })
  async registerProduct(
    @CurrentUser() user: any,
    @Body() input: UpdateShopInput,
  ): Promise<Output> {
    try {
    } catch (error) {
      this.logger.error(error);
      return {
        result: error.response,
      };
    }
  }
}
