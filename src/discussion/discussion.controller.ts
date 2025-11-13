import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { DiscussionService } from './discussion.service';
import { CreateDiscussionDto } from './dto/create-discussion.dto';

@Controller('discussion')
export class DiscussionController {
  constructor(private readonly discussionService: DiscussionService) {}

  @Post('create/:id')
  create(
    @Body() createDiscussionDto: CreateDiscussionDto,
    @Param('id') id: number,
  ) {
    return this.discussionService.create(createDiscussionDto, +id);
  }

  @Get('getlist/:id')
  findAll(@Param('id') id: number) {
    return this.discussionService.getall(+id);
  }
}
