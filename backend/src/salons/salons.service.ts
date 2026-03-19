import { UsersService } from './../users/users.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Salon } from './entities/salon.entity';
import { Model } from 'mongoose';

@Injectable()
export class SalonsService {
  constructor(
    @InjectModel('Salon') private readonly salonModel: Model<Salon>,
    private readonly usersService: UsersService
  ) { }
  async create(createSalonDto: CreateSalonDto, req: any) {
    try {
      const owner = await this.usersService.findOne(createSalonDto.owner, req);
      if (!owner) {
        return new HttpException('Ega ma\'lumoti topilmadi', HttpStatus.NOT_FOUND);
      }
      const { userId, role } = req.user
      if (owner._id.toString() !== userId && role !== 'admin') {
        return new HttpException('Siz bu foydalanuvchi uchun salon yaratish uchun ruxsatga ega emassiz', HttpStatus.FORBIDDEN);
      }
      const createdSalon = await this.salonModel.create({ ...createSalonDto, owner: owner._id });
      const savedSalon = await createdSalon.save();
      return {
        message: 'Salon muvaffaqiyatli yaratildi',
        createdSalon,
        savedSalon
      }
    } catch (error) {
      return new HttpException('Salon yaratishda xatolik yuz berdi: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(req: any) {
    try {
      const { role } = req.user;
      if (role === 'admin') {
        throw new HttpException('Siz bu ma\'lumotlarni ololmaysiz', HttpStatus.FORBIDDEN);
      }
      return await this.salonModel.find().populate('owner').populate('employees');
    } catch (error) {
      throw new HttpException('Xatolik yuz berdi: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string, req: any) {
    try {
      const { userId, role } = req.user;
      if (userId !== id && role !== 'admin') {
        throw new HttpException('Siz bu ma\'lumotlarni ololmaysiz', HttpStatus.FORBIDDEN);
      }
      const salon = await this.salonModel.findById(id).populate('owner').populate('employees');
      if (!salon) {
        throw new HttpException('Salon topilmadi', HttpStatus.NOT_FOUND);
      }
      return salon;
    } catch (error) {
      throw new HttpException('Xatolik yuz berdi: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, updateSalonDto: UpdateSalonDto, req: any) {
    try {
      const { userId, role } = req.user;
      if (userId !== id && role !== 'admin') {
        throw new HttpException('Siz bu ma\'lumotlarni yangilash uchun ruxsatga ega emassiz', HttpStatus.FORBIDDEN);
      }
      if (role !== 'admin') {
        if (updateSalonDto.rating) delete updateSalonDto.rating;
      }
      const salon = await this.salonModel.findById(id);
      if (!salon) {
        throw new HttpException('Salon topilmadi', HttpStatus.NOT_FOUND);
      }
      return await this.salonModel.findByIdAndUpdate(id, updateSalonDto, { new: true });
    } catch (error) {
      throw new HttpException('Xatolik yuz berdi: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string, req: any) {
    try {
      const { userId, role } = req.user;
      if (userId !== id && role !== 'admin') {
        throw new HttpException('Siz bu ma\'lumotlarni o\'chirish uchun ruxsatga ega emassiz', HttpStatus.FORBIDDEN);
      }
      const salon = await this.salonModel.findById(id);
      if (!salon) {
        throw new HttpException('Salon topilmadi', HttpStatus.NOT_FOUND);
      }
      return await this.salonModel.findByIdAndDelete(id);
    } catch (error) {
      throw new HttpException('Xatolik yuz berdi: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
