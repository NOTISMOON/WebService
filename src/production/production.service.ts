import { Injectable } from '@nestjs/common';
import { CreateProductionDto } from './dto/create-production.dto';
import { UpdateProductionDto } from './dto/update-production.dto';
import { Production } from './entities/production.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductionService {
  @InjectRepository(Production)
  private readonly production: Repository<Production>;
  @InjectRepository(User) private readonly user: Repository<User>;
  async create(key, Dto: CreateProductionDto) {
    const Production = this.production.create(Dto);
    const user = await this.user.findOne({
      where: { phoneNumber: key.phoneNumber },
    });
    if (!user) return { message: '用户不存在', code: 2001 };
    Production.user = user;
    await this.production.save(Production);
    return { message: '产品创建成功', code: 0 };
  }
  async findAll(key: string, page: number = 1, size: number = 5) {
    const [productions, totial] = await Promise.all([
      this.production.find({
        where: { user: { phoneNumber: key } },
        take: size,
        skip: (page - 1) * size,
        order: { createTime: 'DESC' },
      }),
      this.production.count({
        where: { user: { phoneNumber: key } },
      }),
    ]);
    return {
      totial,
      productions,
    };
  }
  findOne(id: number) {
    return  `This action returns a #${id} artical`;
  }
  async update(id: number, UpdateProductionDto: UpdateProductionDto) {
    await this.production.update(id, UpdateProductionDto);
    return {
      message: '产品更新成功',
      code: 0,
    };
  }
  async remove(id: number) {
    await this.production.delete(id);
    return {
      message: '产品删除成功',
      code: 0,
    };
  }
}
