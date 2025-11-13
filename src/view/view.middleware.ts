import { Injectable, NestMiddleware } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
@Injectable()
export class ViewMiddleware implements NestMiddleware {
  constructor(private readonly redisService: RedisService) {}
  async use(req: any, res: any, next: () => void) {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const currentKey = `visitor_user_${req.params.id}:${month}-${day}`;
    // 初始化最近 7 天的 key
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      const key = `visitor_user_${req.params.id}:${m}-${d}`;
      await this.redisService.setIfNotExistsWithExpire(key, 0);
    }
    // 当天访问量 +1
    await this.redisService.increase(currentKey);
    // 格式化输出为 YYYY-MM-DD 格式
    next();
  }
}
