import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateHeroWod {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  history: string;
}
