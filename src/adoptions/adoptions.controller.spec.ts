import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AdoptionsController } from './adoptions.controller';
import { AdoptionsService } from './adoptions.service';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { UpdateAdoptionDto } from './dto/update-adoption.dto';

const mockAdoptionsService = {
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('AdoptionsController (integration-like)', () => {
  let controller: AdoptionsController;
  let service: AdoptionsService;

  const trainerDummy = {
    _id: 'trnr1f77bcf86cd799439011',
    pokemons: [],
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    age: 25,
  };

  const pokemonDummy = {
    _id: 'pkmn1f77bcf86cd799439012',
    name: 'Pikaso',
    trainer: [],
    species: 'Pikachu',
    type: 'Electric',
    sex: 'Male',
    age: 3,
    weight: 6,
    height: 0.4,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdoptionsController],
      providers: [
        {
          provide: AdoptionsService,
          useValue: mockAdoptionsService,
        },
      ],
    }).compile();

    controller = module.get<AdoptionsController>(AdoptionsController);
    service = module.get<AdoptionsService>(AdoptionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create (POST /adoptions/:id)', () => {
    it('should create an adoption and return service result', async () => {
      const trainerId = 'trainer-1';
      const dto: CreateAdoptionDto = { pokemonId: 'pokemon-1' };
      const serviceResult = {
        status: 'Success',
        trainer: trainerDummy,
        pokemon: pokemonDummy,
      };

      service.create.mockResolvedValue(serviceResult);

      const res = await controller.create(trainerId, dto);

      expect(service.create).toHaveBeenCalledWith(trainerId, dto);
      expect(res).toEqual(serviceResult);
    });

    it('should propagate a HttpException from service', async () => {
      const trainerId = 'trainer-1';
      const dto: CreateAdoptionDto = { pokemonId: 'pokemon-1' };
      const error = new HttpException(
        'That Pokemon is already adopted',
        HttpStatus.BAD_REQUEST,
      );

      service.create.mockRejectedValue(error);

      await expect(controller.create(trainerId, dto)).rejects.toThrow(error);
    });

    it('should propagate other errors from service', async () => {
      const trainerId = 'trainer-1';
      const dto: CreateAdoptionDto = { pokemonId: 'pokemon-1' };
      const error = new Error('DB failed');

      service.create.mockRejectedValue(error);

      await expect(controller.create(trainerId, dto)).rejects.toThrow(error);
    });
  });

  describe('update (PUT /adoptions/:id)', () => {
    it('should update an adoption and return service result', async () => {
      const trainerId = 'trainer-2';
      const dto: UpdateAdoptionDto = { pokemonId: 'pokemon-2' };
      const serviceResult = { status: 'Success', trainer: {}, pokemon: {} };

      service.update.mockResolvedValue(serviceResult);

      const res = await controller.update(trainerId, dto);

      expect(service.update).toHaveBeenCalledWith(trainerId, dto);
      expect(res).toEqual(serviceResult);
    });

    it('should propagate a HttpException from service (invalid trainer)', async () => {
      const trainerId = 'bad';
      const dto: UpdateAdoptionDto = { pokemonId: 'pokemon-2' };
      const error = new HttpException(
        'Invalid Trainer ID, validate the value and try again.',
        HttpStatus.BAD_REQUEST,
      );

      service.update.mockRejectedValue(error);

      await expect(controller.update(trainerId, dto)).rejects.toThrow(error);
    });

    it('should propagate generic errors from service', async () => {
      const trainerId = 'trainer-2';
      const dto: UpdateAdoptionDto = { pokemonId: 'pokemon-2' };
      const error = new Error('update DB error');

      service.update.mockRejectedValue(error);

      await expect(controller.update(trainerId, dto)).rejects.toThrow(error);
    });
  });

  // DELETE /adoptions/:id
  describe('remove (DELETE /adoptions/:id)', () => {
    it('should remove adoption and return service result when owner is param trainer', async () => {
      const trainerId = 'trainer-3';
      const dto: UpdateAdoptionDto = { pokemonId: 'pokemon-3' };
      const serviceResult = { status: 'Success', trainer: {}, pokemon: {} };

      service.remove.mockResolvedValue(serviceResult);

      const res = await controller.remove(trainerId, dto);

      expect(service.remove).toHaveBeenCalledWith(trainerId, dto);
      expect(res).toEqual(serviceResult);
    });

    it('should return null or propagate service nulls as provided', async () => {
      const trainerId = 'trainer-3';
      const dto: UpdateAdoptionDto = { pokemonId: 'pokemon-3' };

      service.remove.mockResolvedValue(null);

      const res = await controller.remove(trainerId, dto);

      expect(service.remove).toHaveBeenCalledWith(trainerId, dto);
      expect(res).toBeNull();
    });

    it('should propagate a HttpException from service', async () => {
      const trainerId = 'trainer-3';
      const dto: UpdateAdoptionDto = { pokemonId: 'pokemon-3' };
      const error = new HttpException(
        'Invalid Pokemon ID',
        HttpStatus.BAD_REQUEST,
      );

      service.remove.mockRejectedValue(error);

      await expect(controller.remove(trainerId, dto)).rejects.toThrow(error);
    });

    it('should propagate generic errors from service', async () => {
      const trainerId = 'trainer-3';
      const dto: UpdateAdoptionDto = { pokemonId: 'pokemon-3' };
      const error = new Error('delete failed');

      service.remove.mockRejectedValue(error);

      await expect(controller.remove(trainerId, dto)).rejects.toThrow(error);
    });
  });
});
