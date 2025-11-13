import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(process.cwd(), 'images'),
        filename: (req, file, callback) => {
          const filename = `${new Date().getTime() + extname(file.originalname)}`;
          if (filename) return callback(null, filename);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 10,
      },
      fileFilter(req, file, callback) {
        const allowedMimes = ['image/png', 'image/jpeg'];
        if (allowedMimes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new Error('只支持 PNG 或 JPEG 格式图片'), false);
        }
      },
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
