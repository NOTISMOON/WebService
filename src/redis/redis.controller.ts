import { Controller } from '@nestjs/common';
import { RedisService } from './redis.service';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}
}
