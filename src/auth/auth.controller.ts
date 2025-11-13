import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/create-auth.dto';
import { AuthGuard } from '@nestjs/passport';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/apply')
  async signIn(@Body() body: AuthDto) {
    return await this.authService.apply(body);
  }
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async sinUp(@Req() req: { user: any }) {
    if (!req.user) {
      return { code: 3001, message: '用户名或密码错误' };
    }
    console.log(req.user);
    return await this.authService.login(req.user);
  }
  @Get('/verifyToken')
  async verifyToken(@Query('token') token: string) {
    console.log(token)

    return await this.authService.verifyJWT(token);
  }
  @Post('/refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    try {
      const payload = await this.authService.verifyRefreshToken(refreshToken);
      const tokens = await this.authService.generateTokens({
        id: payload.id,
        username: payload.username,
      });
      return { code: 200, ...tokens };
    } catch {
      return { code: 401, message: 'Refresh Token 失效，请重新登录' };
    }
  }
}
