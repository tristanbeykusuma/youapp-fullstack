/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Chat')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('sendMessage')
  @ApiOperation({ summary: 'Send a message to another user' })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async sendMessage(@Request() req, @Body() sendMessageDto: SendMessageDto) {
    return this.chatService.sendMessage(req.user.userId, sendMessageDto);
  }

  @Get('viewMessages')
  @ApiOperation({ summary: 'View messages in a conversation' })
  @ApiQuery({ name: 'conversationId', type: String })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async viewMessages(
    @Request() req,
    @Query('conversationId') conversationId: string,
    @Query('limit') limit?: number,
  ) {
    return this.chatService.viewMessages(
      req.user.userId,
      conversationId,
      limit ? parseInt(limit.toString()) : 50,
    );
  }

  @Get('conversations')
  @ApiOperation({ summary: 'Get all conversations for current user' })
  @ApiResponse({
    status: 200,
    description: 'Conversations retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getConversations(@Request() req) {
    return this.chatService.getConversations(req.user.userId);
  }

  @Post('markAsRead/:messageId')
  @ApiOperation({ summary: 'Mark a message as read' })
  @ApiResponse({ status: 200, description: 'Message marked as read' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  async markAsRead(@Request() req, @Param('messageId') messageId: string) {
    return this.chatService.markAsRead(req.user.userId, messageId);
  }
}
