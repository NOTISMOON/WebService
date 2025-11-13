import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage} from 'multer';
import { extname, join } from 'node:path';
import { ensureDirSync } from 'fs-extra'; 
import { MulterExceptionFilter } from './upload.filter';
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Post('/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  // 类型应该是Express.Multer.File
  createAvatar(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.create(file);
  }
  @Post('/productImage')
  @UseInterceptors(FileInterceptor('productImage'))
  // 类型应该是Express.Multer.File
  createProductImage(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.create(file);
  }
    @Post('/video')
  @UseInterceptors(FileInterceptor('video'))
  // 类型应该是Express.Multer.File
  createVideoInage(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.create(file);
  }
  /**
   *@description 单个切片验证
   *@param {string} chunk //单个切片
   *@param {string} chunHash//切片哈希
   *@param {number} totalChunks //切片总数
   */
  @UseFilters(new MulterExceptionFilter()) 
  @UseInterceptors(
    FileInterceptor('chunk', {
      storage: diskStorage({
        destination: (req, file, callback) => {
        const fileHash = req.headers['x-file-hash'] as string;
  console.log('前端传递的 fileHash：', fileHash); // 关键！看是否为 undefined
  if (!fileHash) {
    callback(new Error('fileHash 缺失'), null as unknown as string); // 主动抛错，避免卡住
    return;
  }
  const tempDir = join(process.cwd(), 'images/temp', fileHash);
  try {
    ensureDirSync(tempDir);
    callback(null, tempDir);
  } catch (err) {
    console.error('创建目录失败：', err);
    callback(err, null as unknown as string); // 捕获目录创建错误，避免卡住
  }
        },
        filename: (req, file, callback) => {
    const chunkIndex = req.headers['x-chunk-index'] as string
    const filename=req.headers['x-file-name'] as string
          callback(null, `${chunkIndex}.${extname(filename)}`);
        },
        
      }),
       limits: {
        fileSize: 1024 * 1024 * 10,
      },
      fileFilter: (req, file, callback) => {
           callback(null, true); // 不限制类型
      },
    }),)
  @Post('/chunk')
  uplodevideo(@UploadedFile() file: Express.Multer.File, @Body() body) {
    console.log(body)
    return this.uploadService.createVidoeChunk(file, body);
  }

  @Get('/chack-chunk/:id')
  chackuploadvidoe(@Param('id') hash:string) {
    console.log(hash)
    return this.uploadService.checkVideochunk(hash);
  }
  @Post('/merge')
  mergeChunk(@Body() body) {
    return this.uploadService.mergeChunk(body);
  }

}
