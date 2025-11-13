import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ViewService } from './view.service';
import { CreateViewDto } from './dto/create-view.dto';
import { UpdateViewDto } from './dto/update-view.dto';
import { AuthGuard } from '@nestjs/passport';
@Controller('view')
export class ViewController {
  constructor(private readonly viewService: ViewService) {}
  @UseGuards(AuthGuard('jwt'))
  @Get()
  getVlist(@Request() req: Request) {
    return this.viewService.getcount(req);
  }
  @Post(':id')
  lisenview(@Request() req: Request) {
    return this.viewService.logger(req);
  }
}
