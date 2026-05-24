import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { Trainer, TrainersDocument } from './schema/trainers.schema';

@Injectable()
export class TrainersService {
  constructor(
    @InjectModel(Trainer.name) private trainersModel: Model<TrainersDocument>,
  ) {}

  async create(createTrainerDto: CreateTrainerDto) {
    const searchEmail = await this.trainersModel.findOne({
      email: createTrainerDto.email,
    });
    if (searchEmail)
      throw new HttpException(
        'This email is already registered, use another account.',
        HttpStatus.BAD_REQUEST,
      );
    const creation = await this.trainersModel.create(createTrainerDto);
    return creation;
  }

  async findAll() {
    const getAll = await this.trainersModel.find(
      {},
      '_id first_name last_name email age pokemons ',
    );
    return getAll;
  }

  async findOne(id: string) {
    try {
      const searchId = await this.trainersModel.findById(
        id,
        '_id first_name last_name email age pokemons',
      );
      if (!searchId) throw new Error('Invalid ID');
      return searchId;
    } catch {
      throw new HttpException(
        'Invalid Trainer ID, validate the value and try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: string, updateTrainerDto: UpdateTrainerDto) {
    try {
      const searchId = await this.trainersModel.findById(id);
      if (!searchId) throw new Error('Invalid ID');
    } catch {
      throw new HttpException(
        'Invalid Trainer ID, validate the value and try again.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const update = await this.trainersModel.findByIdAndUpdate(
      id,
      updateTrainerDto,
      {
        returnDocument: 'after',
        select: '_id first_name last_name email age pokemons',
      },
    );
    return update;
  }

  async remove(id: string) {
    const removal = await this.trainersModel.findByIdAndDelete(id);
    return removal;
  }
}
