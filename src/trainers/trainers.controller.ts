import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { TrainersService } from './trainers.service';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';

@Controller('trainers')
export class TrainersController {
  constructor(private readonly trainersService: TrainersService) {}

  @Post()
  @ApiOperation({ description: 'Create a new trainer.' })
  create(@Body() createTrainerDto: CreateTrainerDto) {
    return this.trainersService.create(createTrainerDto);
  }

  @Get()
  @ApiOperation({ description: 'Retrieve the list of all trainers.' })
  findAll() {
    const data = this.trainersService.findAll();
    return data;
  }

  @Get(':id')
  @ApiOperation({ description: 'Retrieve a single trainer by its ID.' })
  findOne(@Param('id') id: string) {
    return this.trainersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ description: 'Update an existing trainer by ID.' })
  update(@Param('id') id: string, @Body() updateTrainerDto: UpdateTrainerDto) {
    return this.trainersService.update(id, updateTrainerDto);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Delete a trainer by ID.' })
  remove(@Param('id') id: string) {
    return this.trainersService.remove(id);
  }
}
