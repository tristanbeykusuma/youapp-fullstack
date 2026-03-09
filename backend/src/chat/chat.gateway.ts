/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');

  // Map to track connected users: userId -> socketId
  private connectedUsers = new Map<string, string>();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    // Remove from connected users
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      if (socketId === client.id) {
        this.connectedUsers.delete(userId);
        this.logger.log(`User ${userId} disconnected`);
        break;
      }
    }
  }

  @SubscribeMessage('register')
  handleRegister(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.connectedUsers.set(data.userId, client.id);
    this.logger.log(`User registered: ${data.userId} with socket ${client.id}`);

    client.emit('registered', {
      message: 'Successfully registered',
      userId: data.userId,
    });
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody()
    data: {
      senderId: string;
      receiverId: string;
      content: string;
      conversationId?: string;
      messageId?: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(
      `Message from ${data.senderId} to ${data.receiverId}`,
      data,
    );

    // Get receiver's socket ID
    const receiverSocketId = this.connectedUsers.get(data.receiverId);

    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('newMessage', {
        senderId: data.senderId,
        content: data.content,
        conversationId: data.conversationId,
        messageId: data.messageId,
        timestamp: new Date(),
      });

      this.logger.log(`Message delivered to ${data.receiverId}`);
    } else {
      this.logger.log(`User ${data.receiverId} is offline`);
    }

    // Acknowledge to sender
    client.emit('messageSent', {
      success: true,
      timestamp: new Date(),
      receiverOnline: !!receiverSocketId,
    });
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody()
    data: {
      senderId: string;
      receiverId: string;
      isTyping: boolean;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const receiverSocketId = this.connectedUsers.get(data.receiverId);

    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('userTyping', {
        userId: data.senderId,
        isTyping: data.isTyping,
      });
    }
  }

  @SubscribeMessage('markAsRead')
  handleMarkAsRead(
    @MessageBody()
    data: {
      messageId: string;
      senderId: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const senderSocketId = this.connectedUsers.get(data.senderId);

    if (senderSocketId) {
      this.server.to(senderSocketId).emit('messageRead', {
        messageId: data.messageId,
      });
    }
  }

  // Method to send notification to a user
  sendNotification(userId: string, notification: any) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('notification', notification);
    }
  }

  isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  getOnlineUsers(): string[] {
    return Array.from(this.connectedUsers.keys());
  }
}
