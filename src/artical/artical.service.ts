import { Injectable } from '@nestjs/common';
import { CreateArticalDto } from './dto/create-artical.dto';
import { UpdateArticalDto } from './dto/update-artical.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Artical } from 'src/artical/entities/artical.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
@Injectable()
export class ArticalService {
  @InjectRepository(Artical) private readonly artical: Repository<Artical>;
  @InjectRepository(User) private readonly user: Repository<User>;
  async create(key, Dto: CreateArticalDto) {
    const Artical = this.artical.create(Dto);
    const user = await this.user.findOne({
      where: { phoneNumber: key.phoneNumber },
    });
    if (!user) return { message: '用户不存在', code: 2001 };
    Artical.user = user;
    await this.artical.save(Artical);
    return { message: '文章创建成功', code: 0 };
  }
  async findAll(key: string, page: number = 1, size: number = 5) {
    const [articals, totial] = await Promise.all([
      this.artical.find({
        where: { user: { phoneNumber: key } },
        take: size,
        skip: (page - 1) * size,
        order: { createTime: 'DESC' },
      }),
      this.artical.count({
        where: { user: { phoneNumber: key } },
      }),
    ]);
    return {
      totial,
      articals,
    };
  }
  findOne(id: number) {
    return `This action returns a #${id} artical`;
  }
  async update(id: number, updateArticalDto: UpdateArticalDto) {
    await this.artical.update(id, updateArticalDto);
    return {
      message: '文章更新成功',
      code: 0,
    };
  }
  async remove(id: number) {
    await this.artical.delete(id);
    return {
      message: '文章删除成功',
      code: 0,
    };
  }
  async getTypelist(req) {
    const list = await this.artical.find({
      where: { user: { phoneNumber: req.user.phoneNumber } },
      relations: ['user'],
    });
    console.log(list);
    const getKeyValue = (arr, key) => {
      const counts = arr.reduce((acc, item) => {
        const name = item[key];
        if (name) {
          acc[name] = (acc[name] || 0) + 1;
        }
        return acc;
      }, {});

      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    };
    return getKeyValue(list, 'category');
  }
}
