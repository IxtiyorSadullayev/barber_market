import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStekDto } from './dto/create-stek.dto';
import { UpdateStekDto } from './dto/update-stek.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Stek } from './schemas/stek.schema';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { SalonsService } from 'src/salons/salons.service';

@Injectable()
export class StekService {
  constructor(
    @InjectModel(Stek.name) private stekModel: Model<Stek>,
    private readonly salonsService: SalonsService,
    private readonly usersService: UsersService
  ) { }
  async create(createStekDto: CreateStekDto, req: any) {
    try {
      const salon = await this.salonsService.findOne(createStekDto.salon, req)
      if (!salon) {
        return new HttpException('Salon ma\'lumoti topilmadi', HttpStatus.NOT_FOUND);
      }

      const user = await this.usersService.findOne(req.user.userId, req);
      if (!user) {
        return new HttpException('Foydalanuvchi ma\'lumoti topilmadi', HttpStatus.NOT_FOUND);
      }
      if (user.isBanned || user.isDeleted) {
        return new HttpException('Foydalanuvchi ma\'lumoti o\'chirilgan yoki bloklangan', HttpStatus.NOT_FOUND);
      } 
      // yaratilayotgan stek salonning ishlash vaqti ichida bo'lishi va boshqa steklar bilan to'qnashmasligi kerak (oraliq 1hour)

      // return await this.stekModel.create(createStekDto);
    } catch (error) {
      throw new HttpException('Stek yaratishda xatolik yuz berdi: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(req: any) {
    try {
      const { role } = req.user;
      if (role === 'admin') {
        throw new HttpException('Siz bu ma\'lumotlarni ololmaysiz', HttpStatus.FORBIDDEN);
      }
      return await this.stekModel.find().populate('salon').populate('owner');
    } catch (error) {
      throw new HttpException('Xatolik yuz berdi: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string, req: any) {
    try {
      // const { userId, role } = req.user;
      const stek = await this.stekModel.findById(id).populate('salon')
      console.log(stek);
      // if (role === 'admin') {
      //   throw new HttpException('Siz bu ma\'lumotlarni ololmaysiz', HttpStatus.FORBIDDEN);
      // }
      // if (!stek) {
      //   throw new HttpException('Stek topilmadi', HttpStatus.NOT_FOUND);
      // }
      // if (stek.user.toString() !== userId && role !== 'admin') {
      //   throw new HttpException('Siz bu ma\'lumotlarni ololmaysiz', HttpStatus.FORBIDDEN);
      // }
      return stek;
    } catch (error) {
      throw new HttpException('Xatolik yuz berdi: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, updateStekDto: UpdateStekDto, req: any) {
    return `This action updates a #${id} stek`;
  }

  async remove(id: string, req: any) {
    return `This action removes a #${id} stek`;
  }
}
