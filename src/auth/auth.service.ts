import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Avatar } from '../avatar/entities/avatar.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly user: Repository<User>,
    @InjectRepository(Avatar) private readonly avatar: Repository<Avatar>,
  ) {}
  async apply(body: AuthDto) {
    if (!body.avatar || !body.name || !body.passWord || !body.phoneNumber)
      return { message: '缺少参数', code: 3001 };
    const oldUser = await this.user.findOne({
      where: { phoneNumber: body.phoneNumber },
    });
    if (oldUser) return { message: '手机号已经被注册用户已经存在', code: 3002 };
    const key = await bcrypt.genSalt(10);
    body.passWord = await bcrypt.hash(body.passWord, key);
    const newUser = this.user.create({
      name: body.name,
      passWord: body.passWord,
      phoneNumber: body.phoneNumber,
    });
    const avatar = this.avatar.create({ avatar: body.avatar });
    newUser.avatar = avatar;
    await this.user.save(newUser);
    return { message: '注册成功', code: 0 };
  }
  async verifyUser(payload: AuthDto) {
    // console.log(payload);
    const user = await this.user.findOne({
      where: { phoneNumber: payload.phoneNumber },
      relations: ['avatar'],
    });
    console.log(
      user,
      !user || !bcrypt.compareSync(payload.passWord, user.passWord),
    );
    if (!user || !bcrypt.compareSync(payload.passWord, user.passWord))
      return null;
    return user;
  }
  async generateTokens(payload: any) {
    const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '1h' });
    const refreshToken =await this.jwtService.signAsync(payload, { expiresIn: '7d' });
    return { accessToken,refreshToken };
  }
  async login(payload: { phoneNumber: string; passWord: string; id: number }) {
    // console.log(payload);
    const token = await this.generateTokens(payload);
    const user = await this.user.findOne({
      where: { phoneNumber: payload.phoneNumber },
      relations: ['avatar'],
    });
    return {
      code: 0,
      message: '登录成功',
      token,
      user,
    };
  }
  async verifyJWT(token: string) {
    try {
      await this.jwtService.verify(token);
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }
  async verifyAccessToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new Error('TOKEN_EXPIRED');
      }
      throw new Error('INVALID_TOKEN');
    }
  }

  async verifyRefreshToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (err) {
      throw new Error('REFRESH_TOKEN_INVALID');
    }
  }
}
