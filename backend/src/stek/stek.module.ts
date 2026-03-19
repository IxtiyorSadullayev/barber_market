import { Module } from '@nestjs/common';
import { StekService } from './stek.service';
import { StekController } from './stek.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Stek, StekSchema } from './schemas/stek.schema';
import { UsersModule } from 'src/users/users.module';
import { SalonsModule } from 'src/salons/salons.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Stek.name, schema: StekSchema }]),
    UsersModule, SalonsModule,
  ],
  controllers: [StekController],
  providers: [StekService],
})
export class StekModule { }
