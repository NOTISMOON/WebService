import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as fs from 'fs'
import { join } from 'path';
import  * as yaml from 'js-yaml'

@Module({
    imports:[ConfigModule.forRoot({
        isGlobal:true,
        load:[()=>{
          const env=process.env.NODE_ENV || 'development'
         let  config =fs.readFileSync(join(process.cwd(),'src', 'myconfig', 'config.yaml'))
       config= yaml.load(config)
        
       return config['app'][env]['datadb']
        }]
    })],  
    exports:[ConfigModule]
})
export class MyconfigModule {}
