import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as z from 'zod';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { Trainer, TrainersDocument } from './schema/trainers.schema';

const trainerValidation = z.object({
  email: z.email(),
});

@Injectable()
export class TrainersService {
  constructor(
    @InjectModel(Trainer.name) private trainersModel: Model<TrainersDocument>,
  ) {}

  async create(createTrainerDto: CreateTrainerDto) {
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

    const emailCheck = trainerValidation.safeParse({
      email: createTrainerDto.email,
    });
    if (!emailCheck.success)
      throw new HttpException(
        'Invalid email format, enter a correctly formatted email!',
        HttpStatus.BAD_REQUEST,
      );

    const searchEmail = await this.trainersModel.findOne({
      email: createTrainerDto.email,
    });
    if (searchEmail)
      throw new HttpException(
        'This email is already registered, use another account.',
        HttpStatus.BAD_REQUEST,
      );

    return await this.trainersModel.create(createTrainerDto);
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

    if (isNaN(updateTrainerDto.age))
      throw new HttpException('Age must be a number!', HttpStatus.BAD_REQUEST);

    if (updateTrainerDto.first_name.length < 2)
      //validar class-validator y class-transform, reemplazaria a Zod
      throw new HttpException(
        'first_name must have at least 2 characters.',
        HttpStatus.BAD_REQUEST,
      );
    if (updateTrainerDto.last_name.length < 5)
      throw new HttpException(
        'last_name must have at least 5 characters.',
        HttpStatus.BAD_REQUEST,
      );

    const update = await this.trainersModel.findByIdAndUpdate(
      id,
      updateTrainerDto,
      {
        returnDocument: 'after',
      },
    );

    return update;
  }

  async remove(id: string) {
    return await this.trainersModel.findByIdAndDelete(id);
  }
}
