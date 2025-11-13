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
import { AuthGuard } from '@nestjs/passport';
import { ProductionService } from './production.service';
import { CreateProductionDto } from './dto/create-production.dto';
import { UpdateProductionDto } from './dto/update-production.dto';
import { AuthJwtGuard } from 'src/auth-jwt/auth-jwt.guard';
@UseGuards(AuthJwtGuard)
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: false,
    transform: true,
  }),
)
@Controller('production')
export class ProductionController {
  constructor(private readonly productionService: ProductionService) {}
  @Post('/create')
  create(@Request() req, @Body() CreateProductionDto: CreateProductionDto) {
    return this.productionService.create(req.user, CreateProductionDto);
  }
  @Get('/list')
  findAll(
    @Request() req,
    @Query('size', new ParseIntPipe()) size: number,
    @Query('page', new ParseIntPipe()) page?: number,
  ) {
    return this.productionService.findAll(req.user?.phoneNumber, page, size);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productionService.findOne(+id);
  }
  @Patch('update/:id')
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() UpdateProductionDto: UpdateProductionDto,
  ) {
    return this.productionService.update(id, UpdateProductionDto);
  }
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.productionService.remove(+id);
  }
}
