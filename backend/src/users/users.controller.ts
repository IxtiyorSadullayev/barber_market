import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersGuard } from './users.guard';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { SharpPipe } from './sharp';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Get()
  @UseGuards(UsersGuard)
  @ApiBearerAuth()
  findAll(@Request() req: any) {
    return this.usersService.findAll(req);
  }

  @Get(':id')
  @UseGuards(UsersGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.usersService.findOne(id, req);
  }

  @Patch(':id')
  @UseGuards(UsersGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor("image"))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        image: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any,
    @UploadedFile(SharpPipe) image: string,
  ) {
    if (image) updateUserDto.image = `/uploads/${image}`;
    return this.usersService.update(id, updateUserDto, req);
  }

  @Delete(':id')
  @UseGuards(UsersGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string, @Request() req: any) {
    return this.usersService.remove(id, req);
  }
}
