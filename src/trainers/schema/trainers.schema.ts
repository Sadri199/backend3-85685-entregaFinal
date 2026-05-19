import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TrainersDocument = HydratedDocument<Trainer>;

@Schema()
export class Trainer {
  @Prop({ required: true })
  first_name!: string;

  @Prop({ required: true })
  last_name!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ default: 18 })
  age!: number;

  @Prop([String])
  pokemons!: string[];
}

export const TrainerSchema = SchemaFactory.createForClass(Trainer);
