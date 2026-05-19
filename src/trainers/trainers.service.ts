import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { Trainer, TrainersDocument } from './schema/trainers.schema';
import { Model } from 'mongoose';

@Injectable()
export class TrainersService {
  constructor(
    @InjectModel(Trainer.name) private trainersModel: Model<TrainersDocument>,
  ) {}

  create(createTrainerDto: CreateTrainerDto) {
    if (
      !createTrainerDto.first_name ||
      !createTrainerDto.last_name ||
      !createTrainerDto.email
    )
      throw new HttpException(
        'Missing Values! first_name, last_name and email are mandatory!',
        HttpStatus.BAD_REQUEST,
      );

    if (isNaN(createTrainerDto.age))
      throw new HttpException('Age must be a number!', HttpStatus.BAD_REQUEST);
    // validate if email was already on db with a findOne
    return this.trainersModel.create(createTrainerDto);
  }

  findAll() {
    return this.trainersModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} trainer`;
  }

  update(id: number, updateTrainerDto: UpdateTrainerDto) {
    return `This action updates a #${id} trainer`;
  }

  remove(id: number) {
    return `This action removes a #${id} trainer`;
  }
}
