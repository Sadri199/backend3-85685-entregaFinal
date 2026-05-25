import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { PokemonsService } from './pokemons.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Controller('pokemons')
export class PokemonsController {
  constructor(private readonly pokemonsService: PokemonsService) {}

  @Post()
  @ApiOperation({ description: 'Create a new pokemon.' })
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonsService.create(createPokemonDto);
  }

  @Get()
  @ApiOperation({ description: 'Retrieve all pokemons.' })
  findAll() {
    return this.pokemonsService.findAll();
  }

  @Get('/types')
  @ApiOperation({ description: 'Retrieve the available pokemon types.' })
  getTypes() {
    return this.pokemonsService.getTypes();
  }

  @Get('/species')
  @ApiOperation({ description: 'Retrieve the available pokemon species.' })
  getSpecies() {
    return this.pokemonsService.getSpecies();
  }

  @Get(':id')
  @ApiOperation({ description: 'Retrieve a single pokemon by its ID.' })
  findOne(@Param('id') id: string) {
    return this.pokemonsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ description: 'Update an existing pokemon by ID.' })
  update(@Param('id') id: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    return this.pokemonsService.update(id, updatePokemonDto);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Delete a pokemon by ID.' })
  remove(@Param('id') id: string) {
    return this.pokemonsService.remove(id);
  }
}
