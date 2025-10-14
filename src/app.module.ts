import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { JwtverifyModule } from './JWT/JWTverify.module';
import { AvatarModule } from './avatar/avatar.module';
import { UserModule } from './user/user.module';
import { UploadModule } from './upload/upload.module';
import { ArticalModule } from './artical/artical.module';
import { ProductionModule } from './production/production.module';
import {ConfigService } from '@nestjs/config';
import { DiscussionModule } from './discussion/discussion.module';
import { MyconfigModule } from './myconfig/myconfig.module';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [MyconfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: config.get<'mysql' | 'postgres'>('type') as
          | 'mysql'
          | 'postgres',
        username: config.get<string>('username'),
        password: config.get<string>('password'),
        host: config.get<string>('host'),
        port: config.get<number>('port'),
        database: config.get<string>('database'),
        //entities: [__dirname + '/**/*.entity{.ts,.js}'], //实体文件（不建议）
        synchronize: true, //synchronize字段代表是否自动将实体类同步到数据库(生产环境不太建议,开发环境可以)
        retryDelay: 500, //重试连接数据库间隔
        retryAttempts: 10, //重试连接数据库的次数
        autoLoadEntities: true, //如果为true,将自动加载实体 forFeature()方法注册的每个实体都将自动添加到配置对象的实体数组
        logging: true, // 开启日志
      }),
    }),
    AuthModule,
    JwtverifyModule,
    UserModule,
    AvatarModule,
    UploadModule,
    ArticalModule,
    ProductionModule,
    DiscussionModule,
    MyconfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
