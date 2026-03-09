/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Conversation,
  ConversationDocument,
} from '../schemas/conversation.schema';
import { Message, MessageDocument } from '../schemas/message.schema';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
  ) {}

  async sendMessage(senderId: string, sendMessageDto: SendMessageDto) {
    console.log('sendMessage called with:', { senderId, sendMessageDto });

    const { receiverId, content } = sendMessageDto;

    // Find or create conversation between these two users
    let conversation = await this.conversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    console.log(
      '🔍 Conversation found:',
      conversation ? conversation._id : 'None',
    );

    if (!conversation) {
      // Create new conversation
      conversation = new this.conversationModel({
        participants: [senderId, receiverId],
      });
      await conversation.save();
      console.log('✅ New conversation created with ID:', conversation._id);
    }

    console.log('💾 Creating message with conversationId:', conversation._id);

    // Create message
    const message = new this.messageModel({
      conversationId: conversation._id,
      senderId,
      receiverId,
      content,
      timestamp: new Date(),
    });

    console.log('💾 Message object before save:', {
      conversationId: message.conversationId,
      senderId: message.senderId,
      receiverId: message.receiverId,
      content: message.content,
    });

    await message.save();

    console.log('✅ Message saved with ID:', message._id);

    // Update conversation's last message
    conversation.lastMessage = {
      content,
      senderId: new Types.ObjectId(senderId),
      timestamp: new Date(),
    };
    await conversation.save();

    return {
      message: 'Message sent successfully',
      data: {
        messageId: message._id,
        conversationId: conversation._id,
        timestamp: message.timestamp,
      },
    };
  }

  async viewMessages(userId: any, conversationId: string, limit = 50) {
    console.log('📥 viewMessages called with:', {
      userId,
      userIdType: typeof userId,
      conversationId,
    });

    const conversation = await this.conversationModel
      .findById(conversationId)
      .lean()
      .exec();

    if (!conversation) {
      console.error('❌ Conversation not found:', conversationId);
      throw new NotFoundException('Conversation not found');
    }

    console.log('✅ Conversation found:', {
      id: conversation._id,
      participants: conversation.participants,
    });

    // Convert userId to string for comparison (handles both ObjectId and string)
    const userIdString = userId.toString();

    // Check if user is a participant
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === userIdString,
    );

    console.log('🔐 Checking participant:', {
      userIdString,
      participants: conversation.participants.map((p) => p.toString()),
      isParticipant,
    });

    if (!isParticipant) {
      console.error('❌ Access denied - user not in participants');
      throw new ForbiddenException('Access denied to this conversation');
    }

    console.log('✅ User is participant, fetching messages...');

    console.log('🔍 Querying messages with conversationId:', conversationId);

    // Convert conversationId string to ObjectId for querying
    const conversationObjectId = new Types.ObjectId(conversationId);
    console.log('🔍 Converted to ObjectId:', conversationObjectId);

    // First, check if ANY messages exist in the database
    const allMessages = await this.messageModel.find().exec();
    console.log(`📊 Total messages in database: ${allMessages.length}`);
    if (allMessages.length > 0) {
      console.log(
        '📋 Sample message:',
        JSON.stringify(allMessages[0], null, 2),
      );
    }

    // First, try without populate to see if that's the issue
    const messagesWithoutPopulate = await this.messageModel
      .find({ conversationId: conversationObjectId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();

    console.log(
      `✅ Found ${messagesWithoutPopulate.length} messages without populate`,
    );
    console.log(
      '📋 Messages without populate:',
      JSON.stringify(messagesWithoutPopulate, null, 2),
    );

    // Now try with populate
    const messages = await this.messageModel
      .find({ conversationId: conversationObjectId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('senderId', 'username')
      .populate('receiverId', 'username')
      .exec();

    console.log(`✅ Found ${messages.length} messages with populate`);

    return {
      data: {
        conversationId,
        messages: messages.reverse().map((msg) => ({
          id: msg._id.toString(),
          senderId: (msg.senderId as any)._id.toString(),
          receiverId: (msg.receiverId as any)._id.toString(),
          content: msg.content,
          readStatus: msg.readStatus,
          timestamp: msg.timestamp,
        })),
      },
    };
  }

  async getConversations(userId: string) {
    const conversations = await this.conversationModel
      .find({ participants: userId })
      .populate('participants', 'username email')
      .sort({ updatedAt: -1 })
      .exec();

    return {
      data: {
        conversations: conversations.map((conv) => ({
          id: conv._id.toString(),
          participants: conv.participants.map((p: any) => ({
            id: p._id.toString(), // ← ADD THIS - converts MongoDB ObjectId to string
            username: p.username,
            email: p.email,
          })),
          lastMessage: conv.lastMessage
            ? {
                content: conv.lastMessage.content,
                senderId: conv.lastMessage.senderId.toString(),
                timestamp: conv.lastMessage.timestamp,
              }
            : undefined,
          updatedAt: conv.updatedAt,
        })),
      },
    };
  }

  async markAsRead(userId: string, messageId: string) {
    const message = await this.messageModel.findOne({
      _id: messageId,
      receiverId: userId,
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    message.readStatus = true;
    await message.save();

    return {
      message: 'Message marked as read',
    };
  }
}
