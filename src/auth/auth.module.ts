import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Avatar } from '../avatar/entities/avatar.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Avatar]),
    JwtModule.register({
      secret: 'xya-0526',
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
