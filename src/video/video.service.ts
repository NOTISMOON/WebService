import { Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { Repository } from 'typeorm';
@Injectable()
export class VideoService {
  constructor(@InjectRepository(Video) private readonly video:Repository<Video> 
){
  }
  async create(dto: CreateVideoDto) {
    const obj=dto
    const Obj=this.video.create(obj)
  const videoObj=  await this.video.save (Obj)
    return{ 
      message:"创建成功",
      code:'0'
    } 
  }
 async findAll(page: number = 1, size: number = 5) {
    const [videos, totial] = await Promise.all([
      this.video.find({
        where: {status:1},
        take: size,
        skip: (page - 1) * size,
        order: { uploadTime: 'DESC' },
      }),
      this.video.count({
        where: { status:1 },
      }),
    ]);
    return {
      totial,
      videos,
    };
  }
 async downfindALL(page: number = 1, size: number = 10) {
  try {
    let skip: number;
    let take: number;
    if (page === 1) {
      console.log(page,'xxxxxx')
      take = 30; // 第一页固定30条
      skip = 0;
    } else {
           console.log(page,'xxxxxx')
      console.log()
      // 其他页：跳过第一页的30条 + 之前页的条数（这里用size控制，而非固定10）
      take = size; 
      skip = 30 + (page - 2) * take; 
    }
    // 查询数据
    const videos = await this.video.find({
      skip,
      take,
      order:  {
      'uploadTime':'DESC'
      }  // 建议添加排序，确保分页顺序稳定
    });

    // 可选：返回总条数，方便前端判断是否有下一页
    const total = await this.video.count();
    return {
      message: 'ok', // 修复拼写错误
      videos,
      total, // 总条数（可选）
      currentPage: page,
      currentSize: take
    };
  } catch (error) {
    // 捕获错误，避免接口崩溃
    return {
      message: '查询失败',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
async findRelation(key:string){
  const lists =await this.video.find({where:{category:key}})
  return {
    message:'ok',
    code:0,
    data:lists
  }
}
 async findOne(id: number) {
    const obj= await this.video.findOne({where:{id}})
     return {
      data:obj
     }
  }
 async  update(id: number, updateVideoDto: UpdateVideoDto) {
     try{
       const obj =await this.video.findOne({where:{id}});
     if(!obj)return{
      message:"不存在"
     }
     Object.assign(obj,updateVideoDto)
    await this.video.save(obj)
    return {
      message:'ok'
    }

     }catch(error){
    return {
      message: '失败',
      error: error instanceof Error ? error.message : String(error)
    };
     }
}
 async remove(id: number) {
     await this.video.delete(id)
   return {
    message:'ok'
   }
  }
}
