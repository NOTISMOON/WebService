import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { TokenExpiredException, UnauthorizedTokenException } from 'src/auth-jwt/jwt-exceptions';

@Catch(Error)
export class AuthGolbalFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
   const response= host.switchToHttp().getResponse()
 if (exception instanceof TokenExpiredException ) {
      return response.status(401).json({
        code: 401,
        message: 'Access Token 已过期',
      });
    }
    if(exception instanceof UnauthorizedTokenException ){
   return response.status(401).json({
      code: 401,
      message: '无效的 Token',
    });
  }
}
}
