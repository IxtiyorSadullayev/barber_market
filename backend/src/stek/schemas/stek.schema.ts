import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Salon } from "src/salons/schemas/salon.schema";
import { User } from "src/users/schemas/user.schema";

export type StekDocument = HydratedDocument<Stek>;

@Schema({ _id: false })
class StekSchedule {
    @Prop({ required: true })
    day: number;

    @Prop({ required: true })
    hour: string;

    @Prop({ required: true })
    minute: string;
}


@Schema({ timestamps: true })
export class Stek {
    @Prop({ required: true, type: Types.ObjectId, ref: 'Salon' })
    salon: Salon;

    @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
    user: User;

    @Prop({ required: false, default: 'waiting', enum: ['waiting', 'accepted', 'rejected', ''] })
    status: string;

    @Prop({ required: true, type: StekSchedule })
    schedules: StekSchedule;
}

export const StekSchema = SchemaFactory.createForClass(Stek);