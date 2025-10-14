import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'; //默认express
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
async function bootstrap() {
  const env = process.env.NODE_ENV || 'development';
  console.log(`📌 当前环境：${env}`);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, 'images'), {
    prefix: '/xya',
  });
  app.get(ConfigService);
  app.enableCors({
    origin: '*', // 允许所有来源（开发环境）
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    // credentials: true, // 如果要携带 cookie，需要改成具体域名 + true
  });
  const port = Number(process.env.PORT) || 3000;
  await app.listen(port,'0.0.0.0');
}
bootstrap();
