import { Controller, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { AdoptionsService } from './adoptions.service';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { UpdateAdoptionDto } from './dto/update-adoption.dto';

@Controller('adoptions')
export class AdoptionsController {
  constructor(private readonly adoptionsService: AdoptionsService) {}

  @Post(':id')
  create(
    @Param('id') id: string,
    @Body() createAdoptionDto: CreateAdoptionDto,
  ) {
    return this.adoptionsService.create(id, createAdoptionDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateAdoptionDto: UpdateAdoptionDto,
  ) {
    return this.adoptionsService.update(id, updateAdoptionDto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Body() updateAdoptionDto: UpdateAdoptionDto,
  ) {
    return this.adoptionsService.remove(id, updateAdoptionDto);
  }
}
