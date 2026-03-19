import { HttpException, HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Favorite } from './schemas/fav.schema';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Favorite') private readonly favModel: Model<Favorite>,
    private readonly jwtService: JwtService
  ) { }

  async onModuleInit() {
    try {
      const indexes = await this.userModel.collection.indexes();
      const hasLegacyPhoneIndex = indexes.some((index) => index.name === 'phoneNumber_1');

      if (hasLegacyPhoneIndex) {
        await this.userModel.collection.dropIndex('phoneNumber_1');
        this.logger.log('Removed legacy index: phoneNumber_1');
      }
    } catch (error) {
      this.logger.warn(`Index sync check failed: ${error.message}`);
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userModel.findOne({
        $or: [
          { phonenumber: createUserDto.phonenumber },
          { email: createUserDto.email }
        ]
      });
      if (existingUser) {
        if (existingUser.phonenumber === createUserDto.phonenumber) {
          throw new HttpException('Bu raqam bilan foydalanuvchi mavjud', HttpStatus.BAD_REQUEST,);
        }
        if (existingUser.email === createUserDto.email) {
          throw new HttpException('Bu email bilan foydalanuvchi mavjud', HttpStatus.BAD_REQUEST,);
        }
      }

      const hash = await bcrypt.hash(createUserDto.password, 10);
      const createdUser = await this.userModel.create({ ...createUserDto, password: hash });
      const savedUser = await createdUser.save();

      const payload = {
        userId: savedUser._id.toString(),
        phonenumber: savedUser?.phonenumber,
        email: savedUser?.email,
        role: savedUser?.role,
      };

      const token = await this.jwtService.signAsync(payload);

      return { token };

    } catch (error) {
      throw new HttpException('Xatolik yuz berdi: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const user = await this.userModel.findOne({
        $or: [
          { phonenumber: loginUserDto.phonenumber },
          { email: loginUserDto.email }
        ]
      })

      if (!user) {
        throw new HttpException('Foydalanuvchi topilmadi', HttpStatus.NOT_FOUND);
      }

      const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);
      if (!isPasswordValid) {
        throw new HttpException('Parol noto\'g\'ri', HttpStatus.UNAUTHORIZED);
      }

      const payload = {
        userId: user._id,
        email: user?.email,
        phonenumber: user?.phonenumber,
        role: user?.role
      }

      const token = await this.jwtService.signAsync(payload);
      return { token };

    } catch (error) {
      throw new HttpException('Xatolik yuz berdi: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(req: any) {
    try {
      const { role } = req.user;
      if (role === 'admin') {
        throw new HttpException('Siz bu ma\'lumotlarni ololmaysiz', HttpStatus.FORBIDDEN);
      }
      const users = await this.userModel.find().populate('favorites');
      return users
    } catch (error) {
      throw new HttpException('Xatolik yuz berdi: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string, req: any) {
    try {
      const { userId, role } = req.user;
      if (role === 'admin' || userId === id) {
        const user = await this.userModel.findById(id).populate('favorites');
        if (!user) {
          throw new HttpException('Foydalanuvchi topilmadi', HttpStatus.NOT_FOUND);
        }
        return user;
      } else {
        throw new HttpException('Siz bu ma\'lumotlarni ololmaysiz', HttpStatus.FORBIDDEN);
      }
    } catch (error) {
      throw new HttpException('Xatolik yuz berdi: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto, req: any) {
    try {
      const { userId, role } = req.user;
      if (role === 'admin' || userId === id) {
        const user = await this.userModel.findById(id);
        if (!user) {
          throw new HttpException('Foydalanuvchi topilmadi', HttpStatus.NOT_FOUND);
        }
        if (updateUserDto.password) {
          updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
        return { message: 'Foydalanuvchi muvaffaqiyatli yangilandi' };
      } else {
        throw new HttpException('Siz bu ma\'lumotlarni yangilay olmaysiz', HttpStatus.FORBIDDEN);
      }
    } catch (error) {
      throw new HttpException('Xatolik yuz berdi: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string, req: any) {
    try {
      const { userId, role } = req.user;
      if (role === 'admin' || userId === id) {
        const user = await this.userModel.findById(id);
        if (!user) {
          throw new HttpException('Foydalanuvchi topilmadi', HttpStatus.NOT_FOUND);
        }
        await this.userModel.findByIdAndDelete(id);
        return new HttpException('Foydalanuvchi muvaffaqiyatli o\'chirildi', HttpStatus.OK);
      } else {
        throw new HttpException('Siz bu ma\'lumotlarni o\'chira olmaysiz', HttpStatus.FORBIDDEN);
      }
    } catch (error) {
      throw new HttpException('Xatolik yuz berdi: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
