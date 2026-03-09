import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ConversationDocument = Conversation & Document;

class LastMessage {
  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  senderId: Types.ObjectId;

  @Prop({ required: true })
  timestamp: Date;
}

@Schema({ timestamps: true })
export class Conversation {
  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
    required: true,
  })
  participants: Types.ObjectId[];

  @Prop({ type: LastMessage })
  lastMessage: LastMessage;

  createdAt: Date;
  updatedAt: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

// Index for faster participant queries
ConversationSchema.index({ participants: 1 });
