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
    if (
      !createPokemonDto.name ||
      !createPokemonDto.species ||
      !createPokemonDto.type ||
      !createPokemonDto.sex ||
      !createPokemonDto.age ||
      !createPokemonDto.weight ||
      !createPokemonDto.height
    )
      throw new HttpException(
        'Missing Values! name, species, type, sex, age, weight and height are mandatory!',
        HttpStatus.BAD_REQUEST,
      );

    if (
      isNaN(createPokemonDto.age) ||
      isNaN(createPokemonDto.weight) ||
      isNaN(createPokemonDto.height)
    )
      throw new HttpException(
        'The values of age, weight and height must be numbers!',
        HttpStatus.BAD_REQUEST,
      );

    return await this.pokemonsModel.create(createPokemonDto);
  }

  async findAll() {
    return await this.pokemonsModel.find();
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
      const searchId = await this.pokemonsModel.findById(id);
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
      await this.pokemonsModel.findById(id);
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
      },
    );

    return update;
  }

  async remove(id: string) {
    return await this.pokemonsModel.findByIdAndDelete(id);
  }
}
