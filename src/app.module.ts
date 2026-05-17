import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrainersModule } from './trainers/trainers.module';
import { PokemonsModule } from './pokemons/pokemons.module';

@Module({
  imports: [TrainersModule, PokemonsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
