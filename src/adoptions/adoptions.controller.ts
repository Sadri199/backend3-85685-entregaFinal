import { Controller, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AdoptionsService } from './adoptions.service';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { UpdateAdoptionDto } from './dto/update-adoption.dto';

@Controller('adoptions')
export class AdoptionsController {
  constructor(private readonly adoptionsService: AdoptionsService) {}

  @Post(':id')
  @ApiOperation({ description: 'Create a new Pokemon adoption for a trainer.' })
  create(
    @Param('id') id: string,
    @Body() createAdoptionDto: CreateAdoptionDto,
  ) {
    return this.adoptionsService.create(id, createAdoptionDto);
  }

  @Put(':id')
  @ApiOperation({ description: 'Update an existing adoption by trainer ID.' })
  update(
    @Param('id') id: string,
    @Body() updateAdoptionDto: UpdateAdoptionDto,
  ) {
    return this.adoptionsService.update(id, updateAdoptionDto);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Remove an adoption from a trainer by ID.' })
  remove(
    @Param('id') id: string,
    @Body() updateAdoptionDto: UpdateAdoptionDto,
  ) {
    return this.adoptionsService.remove(id, updateAdoptionDto);
  }
}
