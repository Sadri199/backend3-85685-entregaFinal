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
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({
    description: 'The age of the trainer.',
    minimum: 1,
    default: 18,
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  age!: number;
}
