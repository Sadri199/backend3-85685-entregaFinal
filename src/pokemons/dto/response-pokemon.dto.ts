import { Expose } from 'class-transformer';

export class ResponsePokemonDto {
  @Expose()
  _id!: string;

  @Expose()
  name!: string;

  @Expose()
  species!: string;

  @Expose()
  type!: string;

  @Expose()
  sex!: string;

  @Expose()
  age!: number;

  @Expose()
  weight!: number;

  @Expose()
  height!: number;

  @Expose()
  trainer!: string[];
}
