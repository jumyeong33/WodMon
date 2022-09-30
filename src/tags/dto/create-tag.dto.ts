import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  NotContains,
} from 'class-validator';

export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(64)
  @NotContains(' ')
  slug: string;
}
