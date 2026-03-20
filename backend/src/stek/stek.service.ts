import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStekDto } from './dto/create-stek.dto';
import { UpdateStekDto } from './dto/update-stek.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Stek } from './schemas/stek.schema';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { SalonsService } from 'src/salons/salons.service';
import { UserDocument } from 'src/users/schemas/user.schema';

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
      const createdStek = await this.stekModel.create({
        ...createStekDto,
        salon: salon,
        user: user
      });
      return createdStek;
    } catch (error) {
      throw new HttpException('Stek yaratishda xatolik yuz berdi: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(req: any) {
    try {
      const { role } = req.user;
      if (role !== 'admin') {
        throw new HttpException('Siz bu ma\'lumotlarni ololmaysiz', HttpStatus.FORBIDDEN);
      }
      return await this.stekModel.find().populate('salon').populate('user');
    } catch (error) {
      throw new HttpException('Xatolik yuz berdi: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string, req: any) {
    try {
      const { userId, role } = req.user;
      const stek = await this.stekModel.findById(id)
        .populate('salon')
        // agar shunday yozsak user._id ni ishlata olamiz, oddiy holatda xatolik bo'ldi
        .populate<{ user: UserDocument }>('user');
      if (!stek) {
        throw new HttpException('Stek topilmadi', HttpStatus.NOT_FOUND);
      }

      if (stek.user._id.toString() !== userId && role !== 'admin') {
        throw new HttpException('Siz bu ma\'lumotlarni ololmaysiz', HttpStatus.FORBIDDEN);
      }

      return stek;
    } catch (error) {
      throw new HttpException('Xatolik yuz berdi: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, updateStekDto: UpdateStekDto, req: any) {
    try {
      const { userId, role } = req.user;
      const stek = await this.stekModel.findById(id)
        .populate('salon')
        // agar shunday yozsak user._id ni ishlata olamiz, oddiy holatda xatolik bo'ldi
        .populate<{ user: UserDocument }>('user');

      if (!stek) {
        throw new HttpException('Stek topilmadi', HttpStatus.NOT_FOUND);
      }
      let updateStek: Stek = stek;
      if (stek.user._id.toString() !== userId && role !== 'admin') {
        throw new HttpException('Siz bu ma\'lumotlarni yangilay olmaysiz', HttpStatus.FORBIDDEN);
      }

      // Faqat admin salonni o'zgartira oladi (o'zgartirishni hohlasa stekni o'chirib boshidan ochsin :|
      if (updateStekDto.salon) {
        if (role === 'admin') {
          const salon = await this.salonsService.findOne(updateStekDto.salon, req);
          if (!salon) {
            throw new HttpException('Salon ma\'lumoti topilmadi', HttpStatus.NOT_FOUND);
          }
          updateStek.salon = salon;
        } else {
          throw new HttpException('Salonni o\'zgartira olmaysiz', HttpStatus.NOT_FOUND);
        }
      }
      // Faqat salonning xodimlari yoki admin stekning statusini o'zgartira oladi
      if (updateStekDto.status && (role === 'admin' || stek.salon.employees.some(emp => emp.toString() === userId))) {
        updateStek.status = updateStekDto.status;
      }
      // Foydalanuvchi userni boshqaga almashtirishga ruxsat berilmaydi
      if (updateStekDto.user) delete updateStekDto.user;

      // Stekning vaqtini yangilashda faqatgina o'zgaruvchi qism yangilanadi, qolganlari saqlanadi
      if (updateStekDto.schedules) {
        updateStek.schedules = {
          day: updateStekDto.schedules.day ?? updateStek.schedules.day,
          hour: updateStekDto.schedules.hour ?? updateStek.schedules.hour,
          minute: updateStekDto.schedules.minute ?? updateStek.schedules.minute,
        };
      }

      const updatedStek = await this.stekModel.findByIdAndUpdate(id, updateStek, { new: true }).populate('salon').populate('user');
      return updatedStek;
    } catch (error) {
      throw new HttpException('Xatolik yuz berdi: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string, req: any) {
    try {
      const { userId, role } = req.user;
      const stek = await this.stekModel.findById(id)
        .populate('salon')
        .populate<{ user: UserDocument }>('user');
      if (!stek) {
        throw new HttpException('Stek topilmadi', HttpStatus.NOT_FOUND);
      }

      if (stek.user._id.toString() !== userId && role !== 'admin') {
        throw new HttpException('Siz bu ma\'lumotlarni o\'chira olmaysiz', HttpStatus.FORBIDDEN);
      }

      const deletedStek = await this.stekModel.findByIdAndDelete(id);
      return { message: 'Stek muvaffaqiyatli o\'chirildi', deletedStek };
    } catch (error) {
      throw new HttpException('Xatolik yuz berdi: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
