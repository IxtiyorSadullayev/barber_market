
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type FavoriteDocument = HydratedDocument<Favorite>;

@Schema({timestamps: true})
export class Favorite {
    @Prop({ required: true })
    firstname: string;

    @Prop({ required: true })
    lastname: string;

    @Prop({ required: true, unique: true })
    phonenumber: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: false, enum: ['male', 'female'] })
    gender: string;

    @Prop({ default: 0 })
    balance: number;

    @Prop({ default: 'user', enum: ['user', 'admin', 'salon'] })
    role: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Favorite' }] })
    favorites: Favorite[];
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);