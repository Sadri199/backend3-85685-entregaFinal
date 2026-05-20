import { OmitType } from '@nestjs/mapped-types';
import { CreateTrainerDto } from './create-trainer.dto';

export class UpdateTrainerDto extends OmitType(CreateTrainerDto, [
  'email',
  'pokemons',
] as const) {}
