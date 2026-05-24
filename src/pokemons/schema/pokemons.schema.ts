import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PokemonsDocument = HydratedDocument<Pokemon>;

@Schema()
export class Pokemon {
  @Prop({ required: true })
  name!: string;

  @Prop({
    required: true,
    enum: [
      'Pidgey',
      'Charmander',
      'Spearow',
      'Machop',
      'Kakuna',
      'Haunter',
      'Magnemite',
      'Squirtle',
      'Bulbasaur',
      'Pikachu',
      'Dragonair',
      'Kadabra',
      'Sableye',
    ],
  })
  species!: string;

  @Prop({
    required: true,
    enum: [
      'Normal',
      'Fire',
      'Flying',
      'Fighting',
      'Poison',
      'Ghost',
      'Steel',
      'Water',
      'Grass',
      'Electric',
      'Dragon',
      'Psychic',
      'Dark',
    ],
  })
  type!: string;

  @Prop({ required: true, enum: ['Male', 'Female'] })
  sex!: string;

  @Prop({ required: true, default: 2, min: 1, max: 100 })
  age!: number;

  @Prop({ required: true, min: 1, max: 100 })
  weight!: number;

  @Prop({ required: true, min: 1, max: 100 })
  height!: number;

  @Prop([String])
  trainer!: string[];
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
