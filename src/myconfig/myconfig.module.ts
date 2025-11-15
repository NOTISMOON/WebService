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
          const configPath = join(process.cwd(), 'src', 'myconfig', 'config.yaml');
          if (!fs.existsSync(configPath)) {
            console.error(`Config file not found at: ${configPath}`);
            return {};
          }
          const configFile = fs.readFileSync(configPath, 'utf8');
          const config = yaml.load(configFile) as Record<string, any>;
          return config?.app?.[env] || {};
        },
      ],
    }),
  ],
  exports: [ConfigModule],
})
export class MyconfigModule {}