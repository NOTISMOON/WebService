import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';
import { InjectRedis, RedisModule } from '@nestjs-modules/ioredis';
import { MyconfigModule } from 'src/myconfig/myconfig.module';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [MyconfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisConfig = configService.get('redis');
        return {
          type: 'single',
         options: {
            host: redisConfig.host,
            port: redisConfig.port,
            db: redisConfig.db,
            password: redisConfig.password,
          },
        };
      },
    }),
  ],
  controllers: [RedisController],
  providers: [RedisService],
  exports: [RedisModule, RedisService],
})
export class RedisModuleConfig implements OnModuleInit {
  private readonly logger = new Logger('RedisStatus');

  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  async onModuleInit() {
    try {
      // ✅ 尝试 PING Redis
      const pong = await this.redisClient.ping();
      if (pong === 'PONG') {
        this.logger.log('✅ Redis 连接成功');
      } else {
        this.logger.warn('⚠️ Redis 返回异常响应: ' + pong);
      }
    } catch (err) {
      this.logger.error('❌ Redis 连接失败:', err.message);
    }
  }
}
