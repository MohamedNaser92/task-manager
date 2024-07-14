import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UsersService) {}
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};
    // console.log('request from interceptor', request.session, userId);

    if (userId) {
      const user = await this.userService.findOne(userId);
      request.CurrentUser = user;
    }
    // console.log('request from interceptor current user 2', request.CurrentUser);
    return next.handle();
  }
}
