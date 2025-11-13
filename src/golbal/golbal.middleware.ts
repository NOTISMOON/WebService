import { Injectable, NestMiddleware } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class GolbalMiddleware implements NestMiddleware {
  constructor( private readonly redis:RedisService ){}
 async  use  (req: any, res: any, next: () => void) {
    const ip =
      req.headers['x-forwarded-for'] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.ip ||
      'unknown';
console.log(ip)
    const key = `ip:${ip}`;
    const countKey = `count:${ip}`;
    const limitKey = `limit:${ip}`;

    try {
      const keyExists = await this.redis.getone(key);
      if (!keyExists) {
        // 第一次访问
        await this.redis.setIfNotExistsWithExpire(key, ip, 60 * 60);
        await this.redis.setIfNotExistsWithExpire(countKey, 1, 60 );
        console.log(`[首次访问] ${ip}`);
        return next();
      }
      // 增加访问计数
      await this.redis.increase(countKey);
      const count = Number(await this.redis.getone(countKey));
      const isBanned = await this.redis.getone(limitKey);

      if (count > 10 || isBanned) {
        await this.redis.setIfNotExistsWithExpire(limitKey, ip, 60 * 60);
        console.warn(`[封禁 IP] ${ip}`);
        // ✅ 直接返回响应，不继续 next()
        return res.status(403).json({
          code: 403,
          message: '你已被封禁，请1小时后再试。',
        });
      }
      next();
    } catch (err) {
      console.error('GlobalMiddleware Error:', err);
      next(); // 保证不阻塞请求
    }
  }
}
