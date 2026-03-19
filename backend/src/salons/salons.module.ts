import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SalonsService } from './salons.service';
import { SalonsController } from './salons.controller';
import { Salon, SalonSchema } from './schemas/salon.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Salon.name, schema: SalonSchema }]),
    UsersModule,
  ],
  controllers: [SalonsController],
  providers: [SalonsService],
})
export class SalonsModule { }
