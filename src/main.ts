import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'; //默认express
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { AuthGolbalFilter } from './golbal/golbal.filter';
async function bootstrap() {
  const env = process.env.NODE_ENV || 'development';
  console.log(`📌 当前环境：${env}`);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(process.cwd(), 'images'), {
    prefix: '/xya',
  });
  app.useGlobalFilters(new AuthGolbalFilter)
  app.get(ConfigService);
  app.enableCors({
     origin: '*', // 前端地址（必须精确，不能用 * 带凭证）
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization , x-file-hash , x-chunk-index , x-file-name ,Range',
    exposedHeaders: [
      'Content-Range' // 允许浏览器读取 Content-Range 头（计算后续分片范围）
    ],
    // credentials: true, // 如果要携带 cookie，需要改成具体域名 + true
  });
    app.use(express.json({ limit: '1000mb' })); // 同时扩大请求体限制
  app.use(express.urlencoded({ limit: '1000mb', extended: true }));
  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
