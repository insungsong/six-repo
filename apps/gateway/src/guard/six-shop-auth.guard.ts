import { SixShopErrorCode } from '@libs/common/constant/six-shop-error-code';
import { SixShopException } from '@libs/common/model/six-shop-exception.model';
import {
  ExecutionContext,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class SixShopAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    switch (context.getType().toString()) {
      case 'http':
        return context.switchToHttp().getRequest();
      case 'graphql':
        return GqlExecutionContext.create(context).getContext().req;
      default:
        throw new SixShopException(SixShopErrorCode.ERROR, 7830);
    }
  }

  handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status: any,
  ): any {
    if (info instanceof TokenExpiredError) {
      if (context.getType().toString() === 'http') {
        throw new SixShopException(
          SixShopErrorCode.INVALID_TOKEN,
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        throw new SixShopException(SixShopErrorCode.TOKEN_EXPIRED, 7830);
      }
    }
    if (info instanceof JsonWebTokenError || !user) {
      if (context.getType().toString() === 'http') {
        throw new SixShopException(
          SixShopErrorCode.INVALID_TOKEN,
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        throw new SixShopException(SixShopErrorCode.INVALID_TOKEN, 7830);
      }
    }
    try {
      return super.handleRequest(err, user, info, context, status);
    } catch (error) {
      Logger.error(error);
      if (context.getType().toString() === 'http') {
        throw new SixShopException(
          SixShopErrorCode.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        throw new SixShopException(SixShopErrorCode.UNAUTHORIZED, 7829);
      }
    }
  }
}
