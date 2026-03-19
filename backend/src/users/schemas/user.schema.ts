
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Favorite } from './fav.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    firstname: string;

    @Prop({ required: true })
    lastname: string;

    @Prop({ required: false, default: null, unique: true })
    phonenumber: string;

    @Prop({ required: false, default: null, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: false, enum: ['male', 'female'], default: null })
    gender: string;

    @Prop({ required: false })
    image: string;

    @Prop({ default: 0 })
    balance: number;

    @Prop({ default: 'user', enum: ['user', 'admin', 'salon'] })
    role: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Favorite' }] })
    favorites: Favorite[];

    @Prop({ required: false, default: false })
    isDeleted: boolean;

    @Prop({ required: false, default: false })
    isBanned: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);