import { SixShopErrorCode } from '@libs/common/constant';
import { SixShopException } from '@libs/common/model';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): any => {
    switch (context.getType().toString()) {
      case 'http':
        return context.switchToHttp().getRequest().user;
      case 'graphql':
        return GqlExecutionContext.create(context).getContext().req.user;
      default:
        throw new SixShopException(SixShopErrorCode.ERROR, 7829);
    }
  },
);
