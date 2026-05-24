import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdoptionsService } from './adoptions.service';
import { AdoptionsController } from './adoptions.controller';
import { Trainer, TrainerSchema } from '../trainers/schema/trainers.schema';
import { Pokemon, PokemonSchema } from '../pokemons/schema/pokemons.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Pokemon.name,
        schema: PokemonSchema,
      },
      {
        name: Trainer.name,
        schema: TrainerSchema,
      },
    ]),
  ],
  controllers: [AdoptionsController],
  providers: [AdoptionsService],
})
export class AdoptionsModule {}
