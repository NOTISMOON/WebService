import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
@Injectable()
export class ViewService {
  constructor(private readonly redisService: RedisService) {}
  async getcount(req) {
    const now = new Date();
    const keys: string[] = [];
    const dates: string[] = [];
    const key_value: object[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${month}-${day}`; // 格式：MM-DD
      const key = `visitor_user_${req.user.id}:${dateStr}`;
      keys.push(key);
      dates.push(dateStr);
    }
    const values = await this.redisService.getlist(keys);
    // 整理成 { 日期: 访问量 } 的格式（注意：Redis返回的是字符串，需要转为数字）
    dates.forEach((item, index) => {
      key_value.push({ name: item, value: values[index] || 0 });
    });
    return key_value;
  }
  //浏览日志
  async logger(req) {
    console.log(req.headers['x-forwarded-for'] || req.connection.remoteAddress);
  }
}
