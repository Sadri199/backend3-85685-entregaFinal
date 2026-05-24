import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTrainerDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @Transform(({ value }) => value.trim())
  first_name!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @Transform(({ value }) => value.trim())
  last_name!: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email!: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  age!: number;
}
