import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { SalonsService } from './salons.service';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import { SalonsGuard } from './salons.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('salons')
export class SalonsController {
  constructor(private readonly salonsService: SalonsService) { }

  @Post()
  @UseGuards(SalonsGuard)
  @ApiBearerAuth()
  create(@Body() createSalonDto: CreateSalonDto, @Request() req: any) {
    return this.salonsService.create(createSalonDto, req);
  }

  @Get()
  @UseGuards(SalonsGuard)
  @ApiBearerAuth()
  findAll(@Request() req: any) {
    return this.salonsService.findAll(req);
  }

  @Get(':id')
  @UseGuards(SalonsGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.salonsService.findOne(id, req);
  }

  @Patch(':id')
  @UseGuards(SalonsGuard)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateSalonDto: UpdateSalonDto, @Request() req: any) {
    return this.salonsService.update(id, updateSalonDto, req);
  }

  @Delete(':id')
  @UseGuards(SalonsGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string, @Request() req: any) {
    return this.salonsService.remove(id, req);
  }
}
