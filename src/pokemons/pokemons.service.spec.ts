import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpStatus } from '@nestjs/common';
import { PokemonsService } from './pokemons.service';
import { Pokemon, PokemonsDocument } from './schema/pokemons.schema';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

describe('PokemonsService', () => {
  let service: PokemonsService;
  let mockPokemonsModel: jest.Mocked<Partial<Model<PokemonsDocument>>>;

  const selectString = '_id name species type sex age weight height trainer';

  const createDto: CreatePokemonDto = {
    name: 'Pika',
    species: 'Pikachu',
    type: 'Electric',
    sex: 'Female',
    age: 1,
    weight: 3,
    height: 1.5,
  };

  const updateDto: UpdatePokemonDto = {
    name: 'Pika',
    species: 'Pikachu',
    type: 'Electric',
    sex: 'Female',
    age: 5,
    weight: 3,
    height: 1.5,
  };

  beforeEach(async () => {
    mockPokemonsModel = {
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    } as jest.Mocked<Partial<Model<PokemonsDocument>>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonsService,
        {
          provide: getModelToken(Pokemon.name),
          useValue: mockPokemonsModel,
        },
      ],
    }).compile();

    service = module.get<PokemonsService>(PokemonsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('creates and returns a pokemon', async () => {
      const dto = createDto;
      const created = { _id: '1', ...dto };

      mockPokemonsModel.create!.mockResolvedValue(created);

      const res = await service.create(dto);

      expect(mockPokemonsModel.create).toHaveBeenCalledWith(dto);
      expect(res).toEqual(created);
    });

    it('propagates DB errors', async () => {
      const dto = createDto;
      const dbError = new Error('DB failure');

      mockPokemonsModel.create!.mockRejectedValue(dbError);

      await expect(service.create(dto)).rejects.toThrow(dbError);
    });
  });

  describe('findAll', () => {
    it('returns all pokemons with selected fields', async () => {
      const items = [
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
      mockPokemonsModel.find!.mockResolvedValue(items);

      const res = await service.findAll();

      expect(mockPokemonsModel.find).toHaveBeenCalledWith({}, selectString);
      expect(res).toEqual(items);
      expect(res).toHaveLength(2);
    });

    it('returns empty array when none exist', async () => {
      mockPokemonsModel.find!.mockResolvedValue([]);

      const res = await service.findAll();

      expect(res).toEqual([]);
    });

    it('propagates DB errors', async () => {
      const dbError = new Error('find failed');
      mockPokemonsModel.find!.mockRejectedValue(dbError);

      await expect(service.findAll()).rejects.toThrow(dbError);
    });
  });

  describe('getTypes / getSpecies', () => {
    it('returns types list', () => {
      const res = service.getTypes();
      expect(res.status).toBe('success');
      expect(Array.isArray(res.types)).toBe(true);
      expect(res.types).toContain('Fire');
    });

    it('returns species list', () => {
      const res = service.getSpecies();
      expect(res.status).toBe('success');
      expect(Array.isArray(res.types)).toBe(true);
      expect(res.types).toContain('Pidgey');
    });
  });

  describe('findOne', () => {
    it('returns a pokemon by id', async () => {
      const id = '507f1f77bcf86cd799439011';
      const doc = { _id: id, ...createDto };
      mockPokemonsModel.findById!.mockResolvedValue(doc);

      const res = await service.findOne(id);

      expect(mockPokemonsModel.findById).toHaveBeenCalledWith(id, selectString);
      expect(res).toEqual(doc);
    });

    it('throws HttpException when not found', async () => {
      mockPokemonsModel.findById!.mockResolvedValue(null);

      await expect(service.findOne('not-found')).rejects.toMatchObject({
        response: 'Invalid Pokemon ID, validate the value and try again.',
        status: HttpStatus.BAD_REQUEST,
      });
    });

    it('throws HttpException when DB throws (invalid id)', async () => {
      mockPokemonsModel.findById!.mockRejectedValue(
        new Error('Invalid ObjectId'),
      );

      await expect(service.findOne('bad-id')).rejects.toMatchObject({
        response: 'Invalid Pokemon ID, validate the value and try again.',
        status: HttpStatus.BAD_REQUEST,
      });
    });
  });

  describe('update', () => {
    it('updates and returns the pokemon when id is valid', async () => {
      const id = '507f1f77bcf86cd799439011';
      const dto = updateDto;
      const updated = { _id: id, ...dto };

      mockPokemonsModel.findById!.mockResolvedValue({ _id: id });
      mockPokemonsModel.findByIdAndUpdate!.mockResolvedValue(updated);

      const res = await service.update(id, dto);

      expect(mockPokemonsModel.findById).toHaveBeenCalledWith(id);
      expect(mockPokemonsModel.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        dto,
        {
          returnDocument: 'after',
          select: selectString,
        },
      );
      expect(res).toEqual(updated);
    });

    it('throws HttpException when id not found', async () => {
      mockPokemonsModel.findById!.mockResolvedValue(null);
      await expect(
        service.update('not-found', updateDto),
      ).rejects.toMatchObject({
        response: 'Invalid Pokemon ID, validate the value and try again.',
        status: HttpStatus.BAD_REQUEST,
      });
      expect(mockPokemonsModel.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('throws HttpException when findById rejects', async () => {
      mockPokemonsModel.findById!.mockRejectedValue(
        new Error('Invalid ObjectId'),
      );
      await expect(service.update('bad-id', updateDto)).rejects.toMatchObject({
        response: 'Invalid Pokemon ID, validate the value and try again.',
        status: HttpStatus.BAD_REQUEST,
      });
    });

    it('propagates DB errors from findByIdAndUpdate', async () => {
      const id = '507f1f77bcf86cd799439011';
      mockPokemonsModel.findById!.mockResolvedValue({ _id: id });
      mockPokemonsModel.findByIdAndUpdate!.mockRejectedValue(
        new Error('update failed'),
      );

      await expect(service.update(id, updateDto)).rejects.toThrow(
        'update failed',
      );
    });
  });

  describe('remove', () => {
    it('removes and returns the deleted pokemon', async () => {
      const id = '507f1f77bcf86cd799439011';
      const deleted = { _id: id, createDto };
      mockPokemonsModel.findByIdAndDelete!.mockResolvedValue(deleted);

      const res = await service.remove(id);

      expect(mockPokemonsModel.findByIdAndDelete).toHaveBeenCalledWith(id);
      expect(res).toEqual(deleted);
    });

    it('returns null when nothing to delete', async () => {
      mockPokemonsModel.findByIdAndDelete!.mockResolvedValue(null);
      const res = await service.remove('not-found');
      expect(res).toBeNull();
    });

    it('propagates DB errors', async () => {
      mockPokemonsModel.findByIdAndDelete!.mockRejectedValue(
        new Error('delete failed'),
      );
      await expect(service.remove('bad')).rejects.toThrow('delete failed');
    });
  });
});
