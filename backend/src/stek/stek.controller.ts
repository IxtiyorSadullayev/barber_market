import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { StekService } from './stek.service';
import { CreateStekDto } from './dto/create-stek.dto';
import { UpdateStekDto } from './dto/update-stek.dto';
import { AppGuard } from 'src/app.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('stek')
export class StekController {
  constructor(
    private readonly stekService: StekService
  ) { }

  @Post()
  @UseGuards(AppGuard)
  @ApiBearerAuth()
  create(@Body() createStekDto: CreateStekDto, @Request() req: any) {
    return this.stekService.create(createStekDto, req);
  }

  @Get()
  @UseGuards(AppGuard)
  @ApiBearerAuth()
  findAll(@Request() req: any) {
    return this.stekService.findAll(req);
  }

  @Get(':id')
  @UseGuards(AppGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.stekService.findOne(id, req);
  }

  @Patch(':id')
  @UseGuards(AppGuard)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateStekDto: UpdateStekDto, @Request() req: any) {
    return this.stekService.update(id, updateStekDto, req);
  }

  @Delete(':id')
  @UseGuards(AppGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string, @Request() req: any) {
    return this.stekService.remove(id, req);
  }
}
