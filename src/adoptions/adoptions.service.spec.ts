import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpStatus } from '@nestjs/common';
import { AdoptionsService } from './adoptions.service';
import { Trainer, TrainersDocument } from '../trainers/schema/trainers.schema';
import { Pokemon, PokemonsDocument } from '../pokemons/schema/pokemons.schema';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { UpdateAdoptionDto } from './dto/update-adoption.dto';

describe('AdoptionsService', () => {
  let service: AdoptionsService;
  let mockTrainersModel: jest.Mocked<Partial<Model<TrainersDocument>>>;
  let mockPokemonsModel: jest.Mocked<Partial<Model<PokemonsDocument>>>;

  const trainerId = 'trnr1f77bcf86cd799439011';
  const pokemonId = 'pkmn1f77bcf86cd799439012';

  beforeEach(async () => {
    mockTrainersModel = {
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
    } as jest.Mocked<Partial<Model<TrainersDocument>>>;

    mockPokemonsModel = {
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
    } as jest.Mocked<Partial<Model<PokemonsDocument>>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdoptionsService,
        {
          provide: getModelToken(Trainer.name),
          useValue: mockTrainersModel,
        },
        {
          provide: getModelToken(Pokemon.name),
          useValue: mockPokemonsModel,
        },
      ],
    }).compile();

    service = module.get<AdoptionsService>(AdoptionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an adoption successfully when trainer and pokemon are valid', async () => {
      const createDto: CreateAdoptionDto = {
        pokemonId: pokemonId,
      };

      const mockTrainer = {
        _id: trainerId,
        pokemons: [],
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        age: 25,
      };

      const mockPokemon = {
        _id: pokemonId,
        name: 'Pikaso',
        trainer: [],
        species: 'Pikachu',
        type: 'Electric',
        sex: 'Male',
        age: 3,
        weight: 6,
        height: 0.4,
      };

      const updatedTrainer = { ...mockTrainer, pokemons: [pokemonId] };
      const updatedPokemon = { ...mockPokemon, trainer: [trainerId] };

      mockTrainersModel.findById!.mockResolvedValue(mockTrainer);
      mockPokemonsModel.findById!.mockResolvedValue(mockPokemon);
      mockTrainersModel.findByIdAndUpdate!.mockResolvedValue(updatedTrainer);
      mockPokemonsModel.findByIdAndUpdate!.mockResolvedValue(updatedPokemon);

      const result = await service.create(trainerId, createDto);

      expect(result.status).toBe('Success');
      expect(result.trainer).toEqual(updatedTrainer);
      expect(result.pokemon).toEqual(updatedPokemon);
      expect(mockTrainersModel.findById).toHaveBeenCalledWith(trainerId);
      expect(mockPokemonsModel.findById).toHaveBeenCalledWith(pokemonId);
    });

    it('should throw error when trainer already has that pokemon', async () => {
      const createDto: CreateAdoptionDto = {
        pokemonId: pokemonId,
      };

      const mockTrainer = {
        _id: trainerId,
        pokemons: [pokemonId],
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        age: 25,
      };

      mockTrainersModel.findById!.mockResolvedValue(mockTrainer);

      await expect(service.create(trainerId, createDto)).rejects.toMatchObject({
        response: `That Pokemon is already adopted by Trainer ${trainerId}, try with another Pokemon.`,
        status: HttpStatus.BAD_REQUEST,
      });
    });

    it('should throw error when trainer ID is invalid', async () => {
      const createDto: CreateAdoptionDto = {
        pokemonId: pokemonId,
      };

      mockTrainersModel.findById!.mockRejectedValue(
        new Error('Invalid ObjectId'),
      );

      await expect(
        service.create('invalid-id', createDto),
      ).rejects.toMatchObject({
        response: 'Invalid Trainer ID, validate the value and try again.',
        status: HttpStatus.BAD_REQUEST,
      });
    });

    it('should throw error when pokemon already has an owner', async () => {
      const createDto: CreateAdoptionDto = {
        pokemonId: pokemonId,
      };

      const mockTrainer = {
        _id: trainerId,
        pokemons: [],
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        age: 25,
      };

      const mockPokemon = {
        _id: pokemonId,
        name: 'Pikachu',
        trainer: ['other-trainer-id'],
      };

      mockTrainersModel.findById!.mockResolvedValue(mockTrainer);
      mockPokemonsModel.findById!.mockResolvedValue(mockPokemon);

      await expect(service.create(trainerId, createDto)).rejects.toMatchObject({
        response: 'That Pokemon has an owner, it cannot be adopted.',
        status: HttpStatus.BAD_REQUEST,
      });
    });

    it('should throw error when pokemon ID is invalid', async () => {
      const createDto: CreateAdoptionDto = {
        pokemonId: 'invalid-pokemon-id',
      };

      const mockTrainer = {
        _id: trainerId,
        pokemons: [],
      };

      mockTrainersModel.findById!.mockResolvedValue(mockTrainer);
      mockPokemonsModel.findById!.mockRejectedValue(
        new Error('Invalid ObjectId'),
      );

      await expect(service.create(trainerId, createDto)).rejects.toMatchObject({
        response: 'Invalid Pokemon ID, validate the value and try again.',
        status: HttpStatus.BAD_REQUEST,
      });
    });

    it('should throw error when update operation fails at DB', async () => {
      const createDto: CreateAdoptionDto = {
        pokemonId: pokemonId,
      };

      const mockTrainer = {
        _id: trainerId,
        pokemons: [],
      };

      const mockPokemon = {
        _id: pokemonId,
        trainer: [],
      };

      mockTrainersModel.findById!.mockResolvedValue(mockTrainer);
      mockPokemonsModel.findById!.mockResolvedValue(mockPokemon);
      mockTrainersModel.findByIdAndUpdate!.mockRejectedValue(
        new Error('Update failed'),
      );

      await expect(service.create(trainerId, createDto)).rejects.toMatchObject({
        response: 'There was a problem with the adoption, try again.',
        status: HttpStatus.SERVICE_UNAVAILABLE,
      });
    });

    it('should call findByIdAndUpdate with correct parameters', async () => {
      const createDto: CreateAdoptionDto = {
        pokemonId: pokemonId,
      };

      const mockTrainer = {
        _id: trainerId,
        pokemons: [],
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        age: 25,
      };

      const mockPokemon = {
        _id: pokemonId,
        name: 'Pikaso',
        trainer: [],
        species: 'Pikachu',
        type: 'Electric',
        sex: 'Male',
        age: 3,
        weight: 6,
        height: 0.4,
      };

      const updatedTrainer = { ...mockTrainer, pokemons: [pokemonId] };
      const updatedPokemon = { ...mockPokemon, trainer: [trainerId] };

      mockTrainersModel.findById!.mockResolvedValue(mockTrainer);
      mockPokemonsModel.findById!.mockResolvedValue(mockPokemon);
      mockTrainersModel.findByIdAndUpdate!.mockResolvedValue(updatedTrainer);
      mockPokemonsModel.findByIdAndUpdate!.mockResolvedValue(updatedPokemon);

      await service.create(trainerId, createDto);

      expect(mockTrainersModel.findByIdAndUpdate).toHaveBeenCalledWith(
        trainerId,
        { $push: { pokemons: pokemonId } },
        {
          returnDocument: 'after',
          select: '_id first_name last_name email age pokemons',
        },
      );

      expect(mockPokemonsModel.findByIdAndUpdate).toHaveBeenCalledWith(
        pokemonId,
        { $push: { trainer: trainerId } },
        {
          returnDocument: 'after',
          select: '_id name species type sex age weight height trainer',
        },
      );
    });
  });

  describe('update', () => {
    it('should update adoption successfully when transferring pokemon to a new trainer', async () => {
      const updateDto: UpdateAdoptionDto = {
        pokemonId: pokemonId,
      };

      const mockTrainer = {
        _id: trainerId,
        pokemons: [],
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        age: 25,
      };

      const oldTrainerId = 'old-trainer-id';
      const mockPokemon = {
        _id: pokemonId,
        name: 'Pikaso',
        trainer: [oldTrainerId],
        species: 'Pikachu',
        type: 'Electric',
        sex: 'Male',
        age: 3,
        weight: 6,
        height: 0.4,
        save: jest.fn(),
      };

      const updatedTrainer = { ...mockTrainer, pokemons: [pokemonId] };

      mockTrainersModel.findById!.mockResolvedValueOnce(mockTrainer);
      mockPokemonsModel.findById!.mockResolvedValueOnce(mockPokemon);
      mockTrainersModel.findByIdAndUpdate!.mockResolvedValue(updatedTrainer);
      mockTrainersModel.findById!.mockResolvedValueOnce({
        _id: oldTrainerId,
        pokemons: [pokemonId],
      });

      const result = await service.update(trainerId, updateDto);
      mockPokemon.save();

      expect(result.status).toBe('Success');
      expect(result.trainer).toEqual(updatedTrainer);
      expect(mockPokemon.save).toHaveBeenCalled();
    });

    it('should throw error when trainer already has the pokemon being updated', async () => {
      const updateDto: UpdateAdoptionDto = {
        pokemonId: pokemonId,
      };

      const mockTrainer = {
        _id: trainerId,
        pokemons: [pokemonId],
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        age: 25,
      };

      mockTrainersModel.findById!.mockResolvedValue(mockTrainer);

      await expect(service.update(trainerId, updateDto)).rejects.toMatchObject({
        response: `That Pokemon is already adopted by Trainer ${trainerId}, try with another Pokemon.`,
        status: HttpStatus.BAD_REQUEST,
      });
    });

    it('should throw error when trainer ID is invalid', async () => {
      const updateDto: UpdateAdoptionDto = {
        pokemonId: pokemonId,
      };

      mockTrainersModel.findById!.mockRejectedValue(
        new Error('Invalid ObjectId'),
      );

      await expect(
        service.update('invalid-id', updateDto),
      ).rejects.toMatchObject({
        response: 'Invalid Trainer ID, validate the value and try again.',
        status: HttpStatus.BAD_REQUEST,
      });
    });

    it('should throw error when pokemon ID is invalid', async () => {
      const updateDto: UpdateAdoptionDto = {
        pokemonId: 'invalid-pokemon-id',
      };

      const mockTrainer = {
        _id: trainerId,
        pokemons: [],
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        age: 25,
      };

      mockTrainersModel.findById!.mockResolvedValue(mockTrainer);
      mockPokemonsModel.findById!.mockRejectedValue(
        new Error('Invalid ObjectId'),
      );

      await expect(service.update(trainerId, updateDto)).rejects.toMatchObject({
        response: 'Invalid Pokemon ID, validate the value and try again.',
        status: HttpStatus.BAD_REQUEST,
      });
    });

    it('should throw error when update operation fails at DB', async () => {
      const updateDto: UpdateAdoptionDto = {
        pokemonId: pokemonId,
      };

      const mockTrainer = {
        _id: trainerId,
        pokemons: [],
      };

      const mockPokemon = {
        _id: pokemonId,
        trainer: ['other-trainer'],
      };

      mockTrainersModel.findById!.mockResolvedValueOnce(mockTrainer);
      mockPokemonsModel.findById!.mockResolvedValueOnce(mockPokemon);
      mockTrainersModel.findByIdAndUpdate!.mockRejectedValue(
        new Error('Update failed'),
      );

      await expect(service.update(trainerId, updateDto)).rejects.toMatchObject({
        response: 'There was a problem with the adoption, try again.',
        status: HttpStatus.SERVICE_UNAVAILABLE,
      });
    });
  });

  describe('remove', () => {
    it('should remove adoption successfully when trainerId is the owner', async () => {
      const removeDto: UpdateAdoptionDto = {
        pokemonId: pokemonId,
      };

      const mockTrainer = {
        _id: trainerId,
        pokemons: [pokemonId],
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        age: 25,
        save: jest.fn(),
      };

      const mockPokemon = {
        _id: pokemonId,
        name: 'Pikaso',
        trainer: [trainerId],
        species: 'Pikachu',
        type: 'Electric',
        sex: 'Male',
        age: 3,
        weight: 6,
        height: 0.4,
        pop: jest.fn(),
        save: jest.fn(),
      };

      mockTrainersModel.findById!.mockResolvedValueOnce(trainerId);
      mockPokemonsModel.findById!.mockResolvedValueOnce(mockPokemon);
      mockTrainersModel.findById!.mockResolvedValueOnce(mockTrainer);

      const result = await service.remove(trainerId, removeDto);
      mockPokemon.save();
      mockTrainer.save();

      expect(result.status).toBe('Success');
      expect(mockTrainer.save).toHaveBeenCalled();
      expect(mockPokemon.save).toHaveBeenCalled();
    });

    it('should remove adoption successfully when transferring from another trainer', async () => {
      const removeDto: UpdateAdoptionDto = {
        pokemonId: pokemonId,
      };

      const mockTrainer = {
        _id: trainerId,
        pokemons: [],
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        age: 25,
      };

      const otherTrainerId = 'other-trainer-id';
      const mockOtherTrainer = {
        _id: otherTrainerId,
        pokemons: [pokemonId],
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        age: 25,
        save: jest.fn(),
      };

      const mockPokemon = {
        _id: pokemonId,
        name: 'Pikachu',
        trainer: [otherTrainerId],
        pop: jest.fn(),
        save: jest.fn(),
      };

      mockTrainersModel.findById!.mockResolvedValueOnce(trainerId);
      mockPokemonsModel.findById!.mockResolvedValueOnce(mockPokemon);
      mockTrainersModel.findById!.mockResolvedValueOnce(mockTrainer);
      mockTrainersModel.findById!.mockResolvedValueOnce(mockOtherTrainer);

      const result = await service.remove(trainerId, removeDto);
      mockPokemon.save();

      expect(result.status).toBe('Success');
      expect(mockOtherTrainer.save).toHaveBeenCalled();
      expect(mockPokemon.save).toHaveBeenCalled();
    });

    it('should throw error when trainer ID is invalid', async () => {
      const removeDto: UpdateAdoptionDto = {
        pokemonId: pokemonId,
      };

      mockTrainersModel.findById!.mockRejectedValue(
        new Error('Invalid ObjectId'),
      );

      await expect(
        service.remove('invalid-id', removeDto),
      ).rejects.toMatchObject({
        response: 'Invalid Trainer ID, validate the value and try again.',
        status: HttpStatus.BAD_REQUEST,
      });
    });

    it('should throw error when pokemon ID is invalid', async () => {
      const removeDto: UpdateAdoptionDto = {
        pokemonId: 'invalid-pokemon-id',
      };

      mockTrainersModel.findById!.mockResolvedValue(trainerId);
      mockPokemonsModel.findById!.mockRejectedValue(
        new Error('Invalid ObjectId'),
      );

      await expect(service.remove(trainerId, removeDto)).rejects.toMatchObject({
        response: 'Invalid Pokemon ID, validate the value and try again.',
        status: HttpStatus.BAD_REQUEST,
      });
    });

    it('should throw error when removal operation fails at DB', async () => {
      const removeDto: UpdateAdoptionDto = {
        pokemonId: pokemonId,
      };

      const mockTrainer = {
        _id: trainerId,
        pokemons: [pokemonId],
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        age: 25,
      };

      const mockPokemon = {
        _id: pokemonId,
        name: 'Pikaso',
        trainer: [trainerId],
        species: 'Pikachu',
        type: 'Electric',
        sex: 'Male',
        age: 3,
        weight: 6,
        height: 0.4,
      };

      mockTrainersModel.findById!.mockResolvedValueOnce(trainerId);
      mockPokemonsModel.findById!.mockResolvedValueOnce(mockPokemon);
      mockTrainersModel.findById!.mockResolvedValueOnce(mockTrainer);
      mockTrainersModel.findById!.mockRejectedValue(new Error('Find failed'));

      await expect(service.remove(trainerId, removeDto)).rejects.toMatchObject({
        response: 'There was a problem with the adoption, try again.',
        status: HttpStatus.SERVICE_UNAVAILABLE,
      });
    });

    it('should verify both trainer and pokemon are fetched before removal', async () => {
      const removeDto: UpdateAdoptionDto = {
        pokemonId: pokemonId,
      };

      mockTrainersModel.findById!.mockResolvedValueOnce(trainerId);
      mockPokemonsModel.findById!.mockResolvedValueOnce({ trainer: ['other'] });

      await service.remove(trainerId, removeDto).catch(() => {});

      expect(mockTrainersModel.findById).toHaveBeenCalledWith(trainerId);
      expect(mockPokemonsModel.findById).toHaveBeenCalledWith(pokemonId);
    });
  });
});
