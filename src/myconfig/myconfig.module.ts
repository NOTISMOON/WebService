import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as fs from 'fs';
import { join } from 'path';
import * as yaml from 'js-yaml';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        () => {
          const env = process.env.NODE_ENV || 'development';
          const configFile = fs.readFileSync(
            join(process.cwd(), 'src', 'myconfig', 'config.yaml'),
            'utf8',
          );
          const config = yaml.load(configFile) as Record<string, any>;
          return config.app[env]; // ✅ 直接返回当前环境的配置
        },
      ],
    }),
  ],
  exports: [ConfigModule],
})
export class MyconfigModule {}
