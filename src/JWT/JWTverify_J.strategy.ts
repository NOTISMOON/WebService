import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
@Injectable()
export class Jwt extends PassportStrategy(Strategy,'jwt') {
  constructor() {
     console.log('jwt已经挂载')
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'xya-0526',
    });
  }
  validate(payload: { phoneNumber: string; passWord: string; id: number }) {
    console.log('jwt已经挂载')
    return payload;
  }
}
