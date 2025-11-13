import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/auth/auth.service';
@Injectable()
export class JWTverify extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'phoneNumber',
      passwordField: 'passWord',
    });
  }
  async validate(phoneNumber: string, passWord: string) {
    const user = await this.authService.verifyUser({ passWord, phoneNumber });
    if (!user) throw new Error('登陆失败，账户不存在或账户密码错误');
    return {
      passWord: user.passWord,
      phoneNumber: user.phoneNumber,
      id: user.id,
    };
  }
}
