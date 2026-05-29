import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TrainersService } from './trainers.service';
import { Trainer, TrainersDocument } from './schema/trainers.schema';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';

describe('TrainersService', () => {
  let service: TrainersService;
  let mockTrainersModel: Partial<Model<TrainersDocument>>;

  const mockCreateTrainerDto: CreateTrainerDto = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    age: 25,
    pokemons: ['123456789abc'],
  };

  const mockCreatedTrainer = {
    _id: '123456789',
    ...mockCreateTrainerDto,
  };

  const mockFindTrainers = [
    {
      _id: '123',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      age: 25,
      pokemons: ['pokemon1'],
    },
    {
      _id: '456',
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane@example.com',
      age: 30,
      pokemons: ['pokemon2', 'pokemon3'],
    },
  ];

  beforeEach(async () => {
    mockTrainersModel = {
      findOne: jest.fn(),
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrainersService,
        {
          provide: getModelToken(Trainer.name),
          useValue: mockTrainersModel,
        },
      ],
    }).compile();

    service = module.get<TrainersService>(TrainersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a trainer when email does not exist', async () => {
      // Simulate query returning no existing trainer with the same email
      mockTrainersModel.findOne.mockResolvedValue(null);
      // Simulate successful creation returning the new trainer object
      mockTrainersModel.create.mockResolvedValue(mockCreatedTrainer);

      // Call the service create method with the sample DTO
      const result = await service.create(mockCreateTrainerDto);

      // Verify the model searched for a duplicate email
      expect(mockTrainersModel.findOne).toHaveBeenCalledWith({
        email: mockCreateTrainerDto.email,
      });
      // Verify the model create method was called with the DTO
      expect(mockTrainersModel.create).toHaveBeenCalledWith(
        mockCreateTrainerDto,
      );
      // Verify the returned value matches the created trainer mock
      expect(result).toEqual(mockCreatedTrainer);
    });

    it('should throw HttpException when email already exists', async () => {
      const existingTrainer = { ...mockCreatedTrainer };
      mockTrainersModel.findOne.mockResolvedValue(existingTrainer);

      await expect(service.create(mockCreateTrainerDto)).rejects.toThrow(
        new HttpException(
          'This email is already registered, use another account.',
          HttpStatus.BAD_REQUEST,
        ),
      );

      expect(mockTrainersModel.findOne).toHaveBeenCalledWith({
        email: mockCreateTrainerDto.email,
      });
      expect(mockTrainersModel.create).not.toHaveBeenCalled();
    });

    it('should return the created trainer with all properties', async () => {
      const newTrainerDto: CreateTrainerDto = {
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane@example.com',
        age: 30,
        pokemons: ['zxc48168415915'],
      };

      const createdTrainer = {
        _id: '987654321',
        ...newTrainerDto,
      };

      mockTrainersModel.findOne.mockResolvedValue(null);
      mockTrainersModel.create.mockResolvedValue(createdTrainer);

      const result = await service.create(newTrainerDto);

      expect(result._id).toBeDefined();
      expect(result.first_name).toBe('Jane');
      expect(result.last_name).toBe('Smith');
      expect(result.email).toBe('jane@example.com');
      expect(result.age).toBe(30);
      expect(result.pokemons).toStrictEqual(['zxc48168415915']);
    });
  });

  describe('findAll', () => {
    it('should return all trainers', async () => {
      mockTrainersModel.find.mockResolvedValue(mockFindTrainers);

      const result = await service.findAll();

      expect(mockTrainersModel.find).toHaveBeenCalledWith(
        {},
        '_id first_name last_name email age pokemons ',
      );
      expect(result).toEqual(mockFindTrainers);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no trainers are in DB.', async () => {
      mockTrainersModel.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });

    it('should propagate database errors', async () => {
      const dbError = new Error('Database connection failed');
      mockTrainersModel.find.mockRejectedValue(dbError);

      await expect(service.findAll()).rejects.toThrow(
        'Database connection failed',
      );
    });
  });

  describe('findOne', () => {
    it('should return a trainer if ID provided is valid', async () => {
      mockTrainersModel.findById.mockResolvedValue(mockCreatedTrainer);

      const result = await service.findOne(mockCreatedTrainer._id);

      expect(mockTrainersModel.findById).toHaveBeenCalledWith(
        mockCreatedTrainer._id,
        '_id first_name last_name email age pokemons',
      );
      expect(result).toEqual(mockCreatedTrainer);
    });

    it('should throw HttpException when trainer ID does not exist', async () => {
      const invalidId = '507f1f77bcf86cd799439011';
      mockTrainersModel.findById.mockResolvedValue(null);

      await expect(service.findOne(invalidId)).rejects.toThrow(
        new HttpException(
          'Invalid Trainer ID, validate the value and try again.',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw HttpException when ID format is invalid', async () => {
      const invalidId = 'invalid-id-format';
      mockTrainersModel.findById.mockRejectedValue(
        new Error('Invalid ObjectId'),
      );

      await expect(service.findOne(invalidId)).rejects.toThrow(
        new HttpException(
          'Invalid Trainer ID, validate the value and try again.',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('update', () => {
    it('should update a trainer successfully when ID is valid', async () => {
      const trainerId = '123456789';
      const updateTrainerDto: UpdateTrainerDto = {
        age: 26,
      };
      const updatedTrainer = {
        _id: trainerId,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        age: 26,
        pokemons: ['123456789abc'],
      };

      mockTrainersModel.findById.mockResolvedValue({ _id: trainerId });
      mockTrainersModel.findByIdAndUpdate.mockResolvedValue(updatedTrainer);

      const result = await service.update(trainerId, updateTrainerDto);

      expect(mockTrainersModel.findById).toHaveBeenCalledWith(trainerId);
      expect(mockTrainersModel.findByIdAndUpdate).toHaveBeenCalledWith(
        trainerId,
        updateTrainerDto,
        {
          returnDocument: 'after',
          select: '_id first_name last_name email age pokemons',
        },
      );
      expect(result).toEqual(updatedTrainer);
    });

    it('should throw HttpException when trainer ID does not exist', async () => {
      const invalidId = '507f1f77bcf86cd799439011';
      const updateTrainerDto: UpdateTrainerDto = { age: 26 };

      mockTrainersModel.findById.mockResolvedValue(null);

      await expect(service.update(invalidId, updateTrainerDto)).rejects.toThrow(
        new HttpException(
          'Invalid Trainer ID, validate the value and try again.',
          HttpStatus.BAD_REQUEST,
        ),
      );

      expect(mockTrainersModel.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('should throw HttpException when ID format is invalid', async () => {
      const invalidId = 'invalid-id';
      const updateTrainerDto: UpdateTrainerDto = { age: 26 };

      mockTrainersModel.findById.mockRejectedValue(
        new Error('Invalid ObjectId'),
      );

      await expect(service.update(invalidId, updateTrainerDto)).rejects.toThrow(
        new HttpException(
          'Invalid Trainer ID, validate the value and try again.',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should update multiple fields at once', async () => {
      const trainerId = '123456789';
      const updateTrainerDto: UpdateTrainerDto = {
        first_name: 'Jane',
        age: 28,
      };

      mockTrainersModel.findById.mockResolvedValue({ _id: trainerId });
      mockTrainersModel.findByIdAndUpdate.mockResolvedValue({
        _id: trainerId,
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@example.com',
        age: 28,
        pokemons: [],
      });

      const result = await service.update(trainerId, updateTrainerDto);

      expect(result.first_name).toBe('Jane');
      expect(result.age).toBe(28);
    });
  });

  describe('remove', () => {
    it('should successfully delete a trainer', async () => {
      const trainerId = '123456789';
      const deletedTrainer = {
        _id: trainerId,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        age: 25,
        pokemons: ['pokemon1'],
      };

      mockTrainersModel.findByIdAndDelete.mockResolvedValue(deletedTrainer);

      const result = await service.remove(trainerId);

      expect(mockTrainersModel.findByIdAndDelete).toHaveBeenCalledWith(
        trainerId,
      );
      expect(result).toEqual(deletedTrainer);
    });

    it('should return null when trainer does not exist', async () => {
      const invalidId = '507f1f77bcf86cd799439011';
      mockTrainersModel.findByIdAndDelete.mockResolvedValue(null);

      const result = await service.remove(invalidId);

      expect(result).toBeNull();
    });

    it('should propagate database errors', async () => {
      const trainerId = '507f1f77bcf86cd799439011';
      const dbError = new Error('Database connection failed');

      mockTrainersModel.findByIdAndDelete.mockRejectedValue(dbError);

      await expect(service.remove(trainerId)).rejects.toThrow(
        'Database connection failed',
      );
    });
  });
});
