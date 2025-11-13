import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseGuards, UsePipes, Query } from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
@UsePipes(new ValidationPipe({
  whitelist:true,
  transform:true
}))
@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}
  @Post()
  create(@Body() createVideoDto: CreateVideoDto) {
    return this.videoService.create(createVideoDto);
  }
  @Get()
  backfindAll(@Query('page') page ? ,@Query('size') size?) {
    return this.videoService.findAll(page,size);
  }
  @Get('/myweb')
  webfindall(@Query('page') page ? ,@Query('size') size?) {
    console.log(page)
    return this.videoService.downfindALL(+page,size);
  }
  @Get('/relation/:key')
  findeRelation(@Param('key')key){
    return this.videoService.findRelation(key)

  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videoService.findOne(+id);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videoService.update(+id, updateVideoDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videoService.remove(+id);
  }
}
