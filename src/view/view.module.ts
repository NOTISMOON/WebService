import { Module, RequestMethod, Type } from '@nestjs/common';
import { ViewService } from './view.service';
import { ViewController } from './view.controller';
import { MiddlewareConsumer, NestModule } from '@nestjs/common/interfaces';
import { ViewMiddleware } from './view.middleware';
import { RedisModuleConfig } from 'src/redis/redis.module';
@Module({
  controllers: [ViewController],
  providers: [ViewService],
  imports: [RedisModuleConfig],
})
export class ViewModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ViewMiddleware)
      .forRoutes({ path: '/view/:id', method: RequestMethod.POST });
  }
}
