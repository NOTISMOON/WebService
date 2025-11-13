import { IsNotEmpty, IsOptional, ValidationArguments } from 'class-validator';
import { Column } from 'typeorm';
export class CreateProductionDto {
  @IsNotEmpty({
    message: (args: ValidationArguments): string => {
      return `${args.property}不能为空`;
    },
  })
  name: string;
  @IsNotEmpty({
    message: (args: ValidationArguments): string => {
      return `${args.property}不能为空`;
    },
  })
  desc: string;
  @IsNotEmpty({
    message: (args: ValidationArguments): string => {
      return `${args.property}不能为空`;
    },
  })
  image: string;
  @IsOptional()
  status?: number;
  @IsNotEmpty({
    message: (args: ValidationArguments): string => {
      return `${args.property}不能为空`;
    },
  })
  @Column()
  link: string;
}
