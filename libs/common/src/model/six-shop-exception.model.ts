import { HttpException, Logger } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { SixShopErrorCode } from '../constant/six-shop-error-code';
import { Output } from './output.model';

/**
 * NestException
 */
export class SixShopException extends HttpException {
  errorMessage?: string | null;

  constructor(
    public code: SixShopErrorCode,
    public statusCode: number = 7829,
    errorMessage?: string | null,
  ) {
    super(code, statusCode);
    this.errorMessage = errorMessage;
  }

  /**
   * processException
   */
  static processException(error: any): Output {
    Logger.debug(JSON.stringify(error));
    if (error instanceof SixShopException) {
      return {
        result: <SixShopErrorCode>error.message,
        errorMessage: error.errorMessage,
      } as Output;
    } else if (error instanceof QueryFailedError) {
      if (error.driverError.routine === 'string_to_uuid') {
        return {
          result: SixShopErrorCode.UUID_ERROR,
          errorMessage: error.message,
        } as Output;
      }
      return {
        result: SixShopErrorCode.QUERY_ERROR,
        errorMessage: error.message,
      } as Output;
    } else {
      return {
        result: SixShopErrorCode.ERROR,
        errorMessage: error.message,
      } as Output;
    }
  }
}
