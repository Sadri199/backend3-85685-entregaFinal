import { Test, TestingModule } from '@nestjs/testing';
import { TrainersController } from './trainers.controller';
import { TrainersService } from './trainers.service';

const mockTrainersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('TrainersController', () => {
  let controller: TrainersController;
  let service: TrainersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainersController],
      providers: [
        {
          provide: TrainersService,
          useValue: mockTrainersService,
        },
      ],
    }).compile();

    controller = module.get<TrainersController>(TrainersController);
    service = module.get<TrainersService>(TrainersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Validate
  describe('POST /trainers - create', () => {
    it('should create a trainer successfully', async () => {
      const createDto: CreateTrainerDto = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        age: 25,
        pokemons: ['pokemon1'],
      };

      const createdTrainer = {
        _id: '123',
        ...createDto,
      };

      mockTrainersService.create.mockResolvedValue(createdTrainer);

      const result = await controller.create(createDto);

      expect(mockTrainersService.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(createdTrainer);
    });

    it('should propagate service errors', async () => {
      const createDto: CreateTrainerDto = {
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'existing@example.com',
        age: 30,
        pokemons: [],
      };

      const error = new HttpException(
        'This email is already registered, use another account.',
        HttpStatus.BAD_REQUEST,
      );

      mockTrainersService.create.mockRejectedValue(error);

      await expect(controller.create(createDto)).rejects.toThrow(error);
    });
  });

  // Validate
  describe('GET /trainers - findAll', () => {
    it('should return all trainers', async () => {
      const trainers = [
        {
          _id: '1',
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          age: 25,
          pokemons: ['pokemon1'],
        },
        {
          _id: '2',
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane@example.com',
          age: 30,
          pokemons: ['pokemon2'],
        },
      ];

      mockTrainersService.findAll.mockResolvedValue(trainers);

      const result = await controller.findAll();

      expect(mockTrainersService.findAll).toHaveBeenCalled();
      expect(result).toEqual(trainers);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no trainers exist', async () => {
      mockTrainersService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  // Validate
  describe('GET /trainers/:id - findOne', () => {
    it('should return a trainer by ID', async () => {
      const trainerId = '507f1f77bcf86cd799439011';
      const trainer = {
        _id: trainerId,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        age: 25,
        pokemons: ['pokemon1'],
      };

      mockTrainersService.findOne.mockResolvedValue(trainer);

      const result = await controller.findOne(trainerId);

      expect(mockTrainersService.findOne).toHaveBeenCalledWith(trainerId);
      expect(result).toEqual(trainer);
    });

    it('should throw error when trainer not found', async () => {
      const trainerId = 'invalid-id';
      const error = new HttpException(
        'Invalid Trainer ID, validate the value and try again.',
        HttpStatus.BAD_REQUEST,
      );

      mockTrainersService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(trainerId)).rejects.toThrow(error);
    });
  });

  // Validate
  describe('PUT /trainers/:id - update', () => {
    it('should update a trainer successfully', async () => {
      const trainerId = '507f1f77bcf86cd799439011';
      const updateDto: UpdateTrainerDto = {
        age: 26,
      };

      const updatedTrainer = {
        _id: trainerId,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        age: 26,
        pokemons: ['pokemon1'],
      };

      mockTrainersService.update.mockResolvedValue(updatedTrainer);

      const result = await controller.update(trainerId, updateDto);

      expect(mockTrainersService.update).toHaveBeenCalledWith(trainerId, updateDto);
      expect(result).toEqual(updatedTrainer);
    });

    it('should throw error when trainer ID is invalid', async () => {
      const trainerId = 'invalid-id';
      const updateDto: UpdateTrainerDto = { age: 26 };
      const error = new HttpException(
        'Invalid Trainer ID, validate the value and try again.',
        HttpStatus.BAD_REQUEST,
      );

      mockTrainersService.update.mockRejectedValue(error);

      await expect(controller.update(trainerId, updateDto)).rejects.toThrow(
        error,
      );
    });
  });

  // Validate
  describe('DELETE /trainers/:id - remove', () => {
    it('should delete a trainer successfully', async () => {
      const trainerId = '507f1f77bcf86cd799439011';
      const deletedTrainer = {
        _id: trainerId,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        age: 25,
        pokemons: ['pokemon1'],
      };

      mockTrainersService.remove.mockResolvedValue(deletedTrainer);

      const result = await controller.remove(trainerId);

      expect(mockTrainersService.remove).toHaveBeenCalledWith(trainerId);
      expect(result).toEqual(deletedTrainer);
    });

    it('should propagate service errors', async () => {
      const trainerId = 'invalid-id';
      const error = new Error('Database error');

      mockTrainersService.remove.mockRejectedValue(error);

      await expect(controller.remove(trainerId)).rejects.toThrow(error);
    });
  });
});
