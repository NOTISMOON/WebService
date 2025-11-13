import { Injectable } from '@nestjs/common';
import { CreateRediDto } from './dto/create-redi.dto';
import { UpdateRediDto } from './dto/update-redi.dto';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}
  async setIfNotExistsWithExpire(
    key: string,
    value: number|string,
    ttlSeconds = 7 * 24 * 60 * 60,
  ) {
    await this.redis.set(key, value, 'EX', ttlSeconds, 'NX');
  }
  async getlist(key: string[]) {
    return await this.redis.mget(key);
  }
 async getone(key:string){
  return await this.redis.get(key);
 }
  async increase(key: string,time?:number) {
    await this.redis.expire(key,10)
    return await this.redis.incr(key);
  }
}
