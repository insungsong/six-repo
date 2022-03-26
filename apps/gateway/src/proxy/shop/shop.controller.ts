import { CustomType } from '@libs/common/constant/custom.type';
import { SixShopErrorCode } from '@libs/common/constant/six-shop-error-code';
import { SixShopServiceType } from '@libs/common/constant/six-shop-service-type';
import { UpdateShopInput } from '@libs/common/dto';
import { RegisterShopInput } from '@libs/common/dto/register-shop.input';
import { Output, SixShopException } from '@libs/common/model';
import { Body, Controller, Logger, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser, ScopedAuth } from '../../decorator';
import { ShopProxyService } from './shop.proxy.service';

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
}
