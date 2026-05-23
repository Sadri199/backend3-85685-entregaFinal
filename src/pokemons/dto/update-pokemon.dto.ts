import { OmitType } from '@nestjs/mapped-types';
import { CreatePokemonDto } from './create-pokemon.dto';

export class UpdatePokemonDto extends OmitType(CreatePokemonDto, [
  'trainer',
] as const) {}
