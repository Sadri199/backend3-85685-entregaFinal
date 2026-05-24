import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { ResponseTrainerDto } from './dto/response-trainer.dto';
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
    const response = plainToInstance(ResponseTrainerDto, creation, {
      excludeExtraneousValues: true,
    });
    return response;
  }

  async findAll() {
    return await this.trainersModel.find();
  }

  async findOne(id: string) {
    try {
      const searchId = await this.trainersModel.findById(id);
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
      await this.trainersModel.findById(id);
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
      },
    );

    const response = plainToInstance(ResponseTrainerDto, update, {
      excludeExtraneousValues: true,
    });
    return response;
  }

  async remove(id: string) {
    const removal = await this.trainersModel.findByIdAndDelete(id)

    const response = plainToInstance(ResponseTrainerDto, removal, {
      excludeExtraneousValues: true,
    });
    return response;
  }
}
