import { createParamDecorator } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContextHost) => {
    const request = context.switchToHttp().getRequest();
    // console.log('request.CurrentUser from decorator', request.CurrentUser);
    return request.CurrentUser;
  },
);
