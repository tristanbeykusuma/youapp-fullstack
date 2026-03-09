import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProfileDocument = Profile & Document;

@Schema({ timestamps: true })
export class Profile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ trim: true })
  displayName: string;

  @Prop({ enum: ['Male', 'Female', 'Other'] })
  gender: string;

  @Prop()
  birthday: Date;

  @Prop()
  horoscope: string;

  @Prop()
  zodiac: string;

  @Prop({ min: 100, max: 300 })
  height: number; // in cm

  @Prop({ min: 30, max: 300 })
  weight: number; // in kg

  @Prop({ type: [String], default: [] })
  interests: string[];

  @Prop()
  about: string;

  @Prop({ type: String, required: false })
  profileImage: string | null;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
