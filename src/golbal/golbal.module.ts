import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { RedisModuleConfig } from 'src/redis/redis.module';
import { GolbalMiddleware } from './golbal.middleware';

@Module({
    imports:[RedisModuleConfig]
})
export class GolbalModule  {
}
