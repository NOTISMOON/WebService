import {
  Controller,
  Body,
  Patch,
  UseGuards,
  Request,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthJwtGuard } from 'src/auth-jwt/auth-jwt.guard';
// import { AuthJwtGuard } from 'src/auth-jwt/auth-jwt.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
@UseGuards(AuthJwtGuard)
  @Patch('/updata')
  update(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.userService.update(req.user.phoneNumber, req.body);
  }
@UseGuards(AuthJwtGuard)
  @Patch('/changePassword')
  changePassword(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.userService.changePassword(req.user.phoneNumber, req.body);
  }
  @Get('userInof/:id')
  getUserInfo(@Param('id') id: number) {
    return this.userService.getUserInof(id);
  }
}
