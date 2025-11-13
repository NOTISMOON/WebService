import { Injectable } from '@nestjs/common';
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Discussion } from './entities/discussion.entity';

@Injectable()
export class DiscussionService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
    @InjectRepository(Discussion)
    private readonly discussion: Repository<Discussion>,
  ) {}
  async create(createDiscussionDto: CreateDiscussionDto, id: number) {
    if (!createDiscussionDto.text)
      return {
        message: '不能为空',
      };
    const dis = this.discussion.create(createDiscussionDto);
    const user = await this.user.findOne({
      where: { id },
      relations: ['discussions'],
    });
    if (!user) return { message: '该用户不存在' };
    user.discussions.push(dis);
    await this.user.save(user);
    return {
      code: 0,
      message: '留言成功',
      data: dis,
    };
  }
  async getall(id: number) {
    const data = await this.discussion.find({ where: { user: { id } } });
    return {
      message: 'ok',
      code: 0,
      data: data,
    };
  }
}
