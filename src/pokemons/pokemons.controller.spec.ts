import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PokemonsController } from './pokemons.controller';
import { PokemonsService } from './pokemons.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

const mockPokemonsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  getTypes: jest.fn(),
  getSpecies: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('PokemonsController', () => {
  let controller: PokemonsController;
  let service: PokemonsService;

  const createDto: CreatePokemonDto = {
    name: 'Pikachucky',
    species: 'Pikachu',
    type: 'Electric',
    sex: 'Male',
    age: 3,
    weight: 6,
    height: 0.4,
  };

  const updateDto: UpdatePokemonDto = {
    name: 'Pikachucky',
    species: 'Pikachu',
    type: 'Electric',
    sex: 'Male',
    age: 23,
    weight: 6,
    height: 0.4,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonsController],
      providers: [
        {
          provide: PokemonsService,
          useValue: mockPokemonsService,
        },
      ],
    }).compile();

    controller = module.get<PokemonsController>(PokemonsController);
    service = module.get<PokemonsService>(PokemonsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /pokemons - create', () => {
    it('should create a pokemon successfully', async () => {
      const dto = createDto;

      const createdPokemon = {
        _id: '1',
        ...dto,
      };

      mockPokemonsService.create.mockResolvedValue(createdPokemon);

      const result = await controller.create(dto);

      expect(mockPokemonsService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(createdPokemon);
    });

    it('should propagate service errors', async () => {
      const dto = createDto;
      const error = new Error('Database error');

      mockPokemonsService.create.mockRejectedValue(error);

      await expect(controller.create(dto)).rejects.toThrow(error);
    });
  });

  describe('GET /pokemons - findAll', () => {
    it('should return all pokemons', async () => {
      const pokemons = [
        {
          _id: '1',
          name: 'Pika',
          species: 'Pikachu',
          type: 'Electric',
          sex: 'Female',
          age: 1,
          weight: 3,
          height: 1.5,
        },
        {
          _id: '2',
          name: 'Bubba',
          species: 'Bulbasaur',
          type: 'Grass',
          sex: 'Male',
          age: 3,
          weight: 4,
          height: 1.2,
        },
      ];

      mockPokemonsService.findAll.mockResolvedValue(pokemons);

      const result = await controller.findAll();

      expect(mockPokemonsService.findAll).toHaveBeenCalled();
      expect(result).toEqual(pokemons);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no pokemons exist', async () => {
      mockPokemonsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });

    it('should propagate service errors', async () => {
      const error = new Error('Database connection failed');
      mockPokemonsService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow(error);
    });
  });

  describe('GET /pokemons/types - getTypes', () => {
    it('should return types list', () => {
      const typesResponse = {
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

      mockPokemonsService.getTypes.mockReturnValue(typesResponse);

      const result = controller.getTypes();

      expect(mockPokemonsService.getTypes).toHaveBeenCalled();
      expect(result.status).toBe('success');
      expect(Array.isArray(result.types)).toBe(true);
      expect(result.types).toContain('Fire');
      expect(result.types).toContain('Electric');
      expect(result.types.length).toBe(13);
    });

    it('should always return status success', () => {
      const typesResponse = {
        status: 'success',
        types: ['Fire', 'Water'],
      };

      mockPokemonsService.getTypes.mockReturnValue(typesResponse);

      const result = controller.getTypes();

      expect(result.status).toBe('success');
    });
  });

  describe('GET /pokemons/species - getSpecies', () => {
    it('should return species list', () => {
      const speciesResponse = {
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

      mockPokemonsService.getSpecies.mockReturnValue(speciesResponse);

      const result = controller.getSpecies();

      expect(mockPokemonsService.getSpecies).toHaveBeenCalled();
      expect(result.status).toBe('success');
      expect(Array.isArray(result.types)).toBe(true);
      expect(result.types).toContain('Pikachu');
      expect(result.types).toContain('Bulbasaur');
      expect(result.types.length).toBe(13);
    });

    it('should always return status success', () => {
      const speciesResponse = {
        status: 'success',
        types: ['Pikachu', 'Bulbasaur'],
      };

      mockPokemonsService.getSpecies.mockReturnValue(speciesResponse);

      const result = controller.getSpecies();

      expect(result.status).toBe('success');
    });
  });

  describe('GET /pokemons/:id - findOne', () => {
    it('should return a pokemon by id', async () => {
      const pokemonId = '507f1f77bcf86cd799439011';
      const pokemon = { _id: pokemonId, ...createDto };

      mockPokemonsService.findOne.mockResolvedValue(pokemon);

      const result = await controller.findOne(pokemonId);

      expect(mockPokemonsService.findOne).toHaveBeenCalledWith(pokemonId);
      expect(result).toEqual(pokemon);
    });

    it('should throw error when pokemon not found', async () => {
      const pokemonId = 'invalid-id';
      const error = new HttpException(
        'Invalid Pokemon ID, validate the value and try again.',
        HttpStatus.BAD_REQUEST,
      );

      mockPokemonsService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(pokemonId)).rejects.toThrow(error);
    });

    it('should throw error on invalid id format', async () => {
      const pokemonId = 'not-a-valid-id';
      const error = new HttpException(
        'Invalid Pokemon ID, validate the value and try again.',
        HttpStatus.BAD_REQUEST,
      );

      mockPokemonsService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(pokemonId)).rejects.toThrow(error);
    });
  });

  describe('PUT /pokemons/:id - update', () => {
    it('should update a pokemon successfully', async () => {
      const pokemonId = '507f1f77bcf86cd799439011';
      const dto = updateDto;

      const updatedPokemon = {
        _id: pokemonId,
        ...dto,
      };

      mockPokemonsService.update.mockResolvedValue(updatedPokemon);

      const result = await controller.update(pokemonId, dto);

      expect(mockPokemonsService.update).toHaveBeenCalledWith(pokemonId, dto);
      expect(result).toEqual(updatedPokemon);
    });

    it('should throw error when pokemon id is invalid', async () => {
      const pokemonId = 'invalid-id';
      const dto = updateDto;
      const error = new HttpException(
        'Invalid Pokemon ID, validate the value and try again.',
        HttpStatus.BAD_REQUEST,
      );

      mockPokemonsService.update.mockRejectedValue(error);

      await expect(controller.update(pokemonId, dto)).rejects.toThrow(error);
    });

    it('should propagate service errors', async () => {
      const pokemonId = '1';
      const dto = updateDto;
      const error = new Error('Database error');

      mockPokemonsService.update.mockRejectedValue(error);

      await expect(controller.update(pokemonId, dto)).rejects.toThrow(error);
    });
  });

  describe('DELETE /pokemons/:id - remove', () => {
    it('should delete a pokemon successfully', async () => {
      const pokemonId = '507f1f77bcf86cd799439011';
      const deletedPokemon = createDto;

      mockPokemonsService.remove.mockResolvedValue(deletedPokemon);

      const result = await controller.remove(pokemonId);

      expect(mockPokemonsService.remove).toHaveBeenCalledWith(pokemonId);
      expect(result).toEqual(deletedPokemon);
    });

    it('should return null when pokemon does not exist', async () => {
      const pokemonId = 'non-existent';

      mockPokemonsService.remove.mockResolvedValue(null);

      const result = await controller.remove(pokemonId);

      expect(result).toBeNull();
    });

    it('should propagate service errors', async () => {
      const pokemonId = '1';
      const error = new Error('Database error');

      mockPokemonsService.remove.mockRejectedValue(error);

      await expect(controller.remove(pokemonId)).rejects.toThrow(error);
    });
  });
});
