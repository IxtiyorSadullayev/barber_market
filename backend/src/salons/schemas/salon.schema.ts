
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type SalonDocument = HydratedDocument<Salon>;

@Schema({ _id: false })
class SalonMap {
    @Prop({ required: true })
    lat: number;

    @Prop({ required: true })
    long: number;
}

@Schema({ _id: false })
class SalonSchedule {
    @Prop({ type: [Number], required: true })
    days: number[];

    @Prop({ required: true })
    from: string;

    @Prop({ required: true })
    to: string;
}

@Schema({ timestamps: true })
export class Salon {
    @Prop({ required: true, unique: true })
    name: string

    @Prop({ required: false, default: 0.00 })
    rating: number;

    @Prop({ type: SalonMap, required: true })
    map: SalonMap;

    @Prop({ type: [String], required: true })
    phones: string[];

    @Prop({ required: true })
    address: string

    @Prop({ type: [String], required: false })
    images: string[];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    owner: mongoose.Types.ObjectId;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] })
    employees: mongoose.Types.ObjectId[];

    @Prop({ type: SalonSchedule, required: true })
    schedules: SalonSchedule;

}

export const SalonSchema = SchemaFactory.createForClass(Salon);