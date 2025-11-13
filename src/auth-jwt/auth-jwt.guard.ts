import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredException, UnauthorizedTokenException } from './jwt-exceptions';
@Injectable()
export class AuthJwtGuard extends AuthGuard('jwt'){
canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
  handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
    console.log(user)
    if (info?.name === 'TokenExpiredError') {
    // token过期，可以触发刷新逻辑
    throw new TokenExpiredException();
  }
  if (err || !user) {
    throw new UnauthorizedTokenException();
  }
  return user;
  }
}
