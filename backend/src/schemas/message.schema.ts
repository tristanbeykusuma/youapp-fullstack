import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'Conversation', required: true })
  conversationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  senderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  receiverId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  readStatus: boolean;

  @Prop({ required: true, default: () => new Date() })
  timestamp: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

// Indexes for faster queries
MessageSchema.index({ conversationId: 1, timestamp: -1 });
MessageSchema.index({ senderId: 1 });
MessageSchema.index({ receiverId: 1 });
