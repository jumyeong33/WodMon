import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWodDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
