import { Module } from '@nestjs/common';
import { DiscussionService } from './discussion.service';
import { DiscussionController } from './discussion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discussion } from './entities/discussion.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Discussion, User])],
  controllers: [DiscussionController],
  providers: [DiscussionService],
})
export class DiscussionModule {}
