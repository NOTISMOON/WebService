import { IsNotEmpty } from "class-validator";


export class CreateVideoDto {
     @IsNotEmpty({message:(ctx)=>`不能为空${ctx.property}`})
    title: string;
      @IsNotEmpty({message:(ctx)=>`不能为空${ctx.property}`})
    duration:string
      @IsNotEmpty({message:(ctx)=>`不能为空${ctx.property}`})
    desc: string;
      @IsNotEmpty({message:(ctx)=>`不能为空${ctx.property}`})
    cover: string;
      @IsNotEmpty({message:(ctx)=>`不能为空${ctx.property}`})
    category: string;
      @IsNotEmpty({message:(ctx)=>`不能为空${ctx.property}`})
    url: string
}
