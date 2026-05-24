import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsNumber,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';

enum pokemonSpecies {
  Pidgey = 'Pidgey',
  Charmander = 'Charmander',
  Spearow = 'Spearow',
  Machop = 'Machop',
  Kakuna = 'Kakuna',
  Haunter = 'Haunter',
  Magnemite = 'Magnemite',
  Squirtle = 'Squirtle',
  Bulbasaur = 'Bulbasaur',
  Pikachu = 'Pikachu',
  Dragonair = 'Dragonair',
  Kadabra = 'Kadabra',
  Sableye = 'Sableye',
}

enum pokemonTypes {
  Normal = 'Normal',
  Fire = 'Fire',
  Flying = 'Flying',
  Fighting = 'Fighting',
  Poison = 'Poison',
  Ghost = 'Ghost',
  Steel = 'Steel',
  Water = 'Water',
  Grass = 'Grass',
  Electric = 'Electric',
  Dragon = 'Dragon',
  Psychic = 'Psychic',
  Dark = 'Dark',
}

enum sexes {
  Male = 'Male',
  Female = 'Female',
}

export class CreatePokemonDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @Transform(({ value }) => value.trim())
  name!: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(pokemonSpecies)
  species!: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(pokemonTypes)
  type!: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(sexes)
  sex!: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  age!: number;

  @IsNumber()
  @Min(1)
  @Max(100)
  weight!: number;

  @IsNumber()
  @Min(1)
  @Max(100)
  height!: number;
}
