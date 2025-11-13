import { Injectable, Param } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Avatar } from 'src/avatar/entities/avatar.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
    @InjectRepository(Avatar) private readonly avater: Repository<Avatar>,
  ) {}
  async update(key: string, Dto: UpdateUserDto) {
    const user = await this.user.findOne({
      where: { phoneNumber: key },
      relations: ['avatar'],
    });
    if (!user) return { message: '不存在该用户' };
    user.email = Dto.email ?? user.email;
    user.name = Dto.name ?? user.name;
    if (Dto.avatar) {
      if (user.avatar) {
        // 已经有头像，更新
        user.avatar.avatar = Dto.avatar;
      } else {
        // 没有头像，新建
        user.avatar = this.avater.create({ avatar: Dto.avatar });
      }
    }
    await this.user.save(user);
    return {
      code: 0,
      message: '更新成功',
    };
  }
  async changePassword(
    key: string,
    body: { passWord: string; newPassword: string },
  ) {
    const user = await this.user.findOne({ where: { phoneNumber: key } });
    if (!user) return { message: 'token无效' };
    if (!bcrypt.compareSync(body.passWord, user.passWord))
      return { message: '原密码错误' };
    const KET = bcrypt.genSaltSync(10);
    body.newPassword = await bcrypt.hash(body.newPassword, KET);

    user.passWord = body.newPassword;
    await this.user.save(user);
    return { code: 0, message: '修改成功' };
  }
  async getUserInof(id: number) {
    const user = await this.user.findOne({
      where: { id },
      relations: ['avatar', 'articals', 'productions', 'discussions'],
    });
    if (user)
      return {
        code: 0,
        data: user,
      };
  }
}
