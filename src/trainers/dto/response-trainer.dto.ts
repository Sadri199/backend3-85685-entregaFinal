import { Exclude, Expose } from 'class-transformer';

export class ResponseTrainerDto {
  @Expose()
  _id!: string;

  @Expose()
  first_name!: string;

  @Expose()
  last_name!: string;

  @Expose()
  email!: string;

  @Expose()
  age!: number;

  @Expose()
  pokemons!: string[];
}
