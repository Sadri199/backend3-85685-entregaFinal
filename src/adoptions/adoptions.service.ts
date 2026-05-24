import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { UpdateAdoptionDto } from './dto/update-adoption.dto';
import { Trainer, TrainersDocument } from '../trainers/schema/trainers.schema';
import { Pokemon, PokemonsDocument } from '../pokemons/schema/pokemons.schema';

@Injectable()
export class AdoptionsService {
  constructor(
    @InjectModel(Trainer.name) private trainersModel: Model<TrainersDocument>,
    @InjectModel(Pokemon.name) private pokemonsModel: Model<PokemonsDocument>,
  ) {}

  async create(id: string, createAdoptionDto: CreateAdoptionDto) {
    try {
      const validateTrainer = await this.trainersModel.findById(id);
      const findPokemon = validateTrainer?.pokemons.find(
        (e) => e === createAdoptionDto.pokemonId,
      );
      if (findPokemon) throw new Error('Pokemon found');
    } catch (err) {
      if (err?.message === 'Pokemon found') {
        throw new HttpException(
          `That Pokemon is already adopted by Trainer ${id}, try with another Pokemon.`,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          'Invalid Trainer ID, validate the value and try again.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    try {
      const validatePokemon = await this.pokemonsModel.findById(
        createAdoptionDto.pokemonId,
      );
      if (validatePokemon!.trainer.length > 0) throw new Error('Pokemon Owned');
    } catch (err) {
      if (err.message === 'Pokemon Owned') {
        throw new HttpException(
          `That Pokemon has an owner, it cannot be adopted.`,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          'Invalid Pokemon ID, validate the value and try again.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    try {
      const updatedTrainer = await this.trainersModel.findByIdAndUpdate(
        id,
        { $push: { pokemons: createAdoptionDto.pokemonId } },
        { returnDocument: 'after' },
      );
      const updatedPokemon = await this.pokemonsModel.findByIdAndUpdate(
        createAdoptionDto.pokemonId,
        { $push: { trainer: id } },
        { returnDocument: 'after' },
      );
      return {
        status: 'Success',
        trainer: updatedTrainer,
        pokemon: updatedPokemon,
      };
    } catch {
      throw new HttpException(
        'There was a problem with the adoption, try again.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async update(id: string, updateAdoptionDto: UpdateAdoptionDto) {
    try {
      const validateTrainer = await this.trainersModel.findById(id);
      const findPokemon = validateTrainer?.pokemons.find(
        (e) => e === updateAdoptionDto.pokemonId,
      );
      if (findPokemon) throw new Error('Pokemon found');
    } catch (err) {
      if (err?.message === 'Pokemon found') {
        throw new HttpException(
          `That Pokemon is already adopted by Trainer ${id}, try with another Pokemon.`,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          'Invalid Trainer ID, validate the value and try again.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    try {
      await this.pokemonsModel.findById(updateAdoptionDto.pokemonId);
    } catch {
      throw new HttpException(
        'Invalid Pokemon ID, validate the value and try again.',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const updatedTrainer = await this.trainersModel.findByIdAndUpdate(
        id,
        { $push: { pokemons: updateAdoptionDto.pokemonId } },
        { returnDocument: 'after' },
      );
      const getPokemon = await this.pokemonsModel.findById(
        updateAdoptionDto.pokemonId,
      );
      const oldTrainer = await this.trainersModel.findByIdAndUpdate(
        getPokemon?.trainer,
        { $pull: { pokemons: updateAdoptionDto.pokemonId } },
      );
      const popped = getPokemon?.trainer.pop();
      const pushed = getPokemon?.trainer.push(id);
      await getPokemon?.save();

      return {
        status: 'Success',
        trainer: updatedTrainer,
        pokemon: getPokemon,
      };
    } catch (err) {
      console.log(err?.message);
      throw new HttpException(
        'There was a problem with the adoption, try again.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async remove(id: string, updateAdoptionDto: UpdateAdoptionDto) {
    try {
      await this.trainersModel.findById(id);
    } catch {
      throw new HttpException(
        'Invalid Trainer ID, validate the value and try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      await this.pokemonsModel.findById(updateAdoptionDto.pokemonId);
    } catch {
      throw new HttpException(
        'Invalid Pokemon ID, validate the value and try again.',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const paramTrainer = await this.trainersModel.findById(id);
      const getPokemon = await this.pokemonsModel.findById(
        updateAdoptionDto.pokemonId,
      );
      if (paramTrainer?._id === getPokemon?.trainer[0]) {
        paramTrainer?.pokemons.pop();
        getPokemon?.trainer.pop();
        await paramTrainer?.save();
        await getPokemon?.save();
        return {
          status: 'Success',
          trainer: paramTrainer,
          pokemon: getPokemon,
        };
      } else {
        const pokemonOwner = await this.trainersModel.findById(
          getPokemon?.trainer,
        );
        pokemonOwner?.pokemons.pop();
        getPokemon?.trainer.pop();
        await pokemonOwner?.save();
        await getPokemon?.save();
        return {
          status: 'Success',
          trainer: pokemonOwner,
          pokemon: getPokemon,
        };
      }
    } catch (err) {
      console.log(err?.message);
      throw new HttpException(
        'There was a problem with the adoption, try again.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
