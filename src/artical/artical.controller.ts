import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ArticalService } from './artical.service';
import { CreateArticalDto } from './dto/create-artical.dto';
import { UpdateArticalDto } from './dto/update-artical.dto';
import { AuthGuard } from '@nestjs/passport';
@UseGuards(AuthGuard('jwt'))
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
@Controller('artical')
export class ArticalController {
  constructor(private readonly articalService: ArticalService) {}
  @Post('/create')
  create(@Request() req, @Body() createArticalDto: CreateArticalDto) {
    return this.articalService.create(req.user, createArticalDto);
  }
   @Get('/type')
  getTypelist(@Request() req ){
    console.log(req.user)
    return this.articalService.getTypelist(req)
  }
  @Get('/list')
  findAll(
    @Request() req,
    @Query('size', new ParseIntPipe()) size: number,
    @Query('page', new ParseIntPipe()) page?: number,
  ) {
    return this.articalService.findAll(req.user?.phoneNumber, page, size);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articalService.findOne(+id);
  }
  @Patch('/update/:id')
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateArticalDto: UpdateArticalDto,
  ) {
    return this.articalService.update(id, updateArticalDto);
  }
  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.articalService.remove(+id);
  }
}
