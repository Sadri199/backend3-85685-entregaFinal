import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon, PokemonsDocument } from './schema/pokemons.schema';

@Injectable()
export class PokemonsService {
  constructor(
    @InjectModel(Pokemon.name) private pokemonsModel: Model<PokemonsDocument>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    const creation = await this.pokemonsModel.create(createPokemonDto);
    return creation;
  }

  async findAll() {
    return await this.pokemonsModel.find(
      {},
      '_id name species type sex age weight height trainer',
    );
  }

  getTypes() {
    return {
      status: 'success',
      types: [
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
    };
  }

  getSpecies() {
    return {
      status: 'success',
      types: [
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
    };
  }

  async findOne(id: string) {
    try {
      const searchId = await this.pokemonsModel.findById(
        id,
        '_id name species type sex age weight height trainer',
      );
      if (!searchId) throw new Error('Invalid ID');
      return searchId;
    } catch {
      throw new HttpException(
        'Invalid Pokemon ID, validate the value and try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const searchId = await this.pokemonsModel.findById(id);
      if (!searchId) throw new Error('Invalid ID');
    } catch {
      throw new HttpException(
        'Invalid Pokemon ID, validate the value and try again.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const update = await this.pokemonsModel.findByIdAndUpdate(
      id,
      updatePokemonDto,
      {
        returnDocument: 'after',
        select: '_id name species type sex age weight height trainer',
      },
    );
    return update;
  }

  async remove(id: string) {
    return await this.pokemonsModel.findByIdAndDelete(id);
  }
}
