/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { multerConfig } from '../common/interceptors/file-upload.interceptor';

@ApiTags('Profile')
@Controller()
@UseGuards(JwtAuthGuard) // All routes are protected
@ApiBearerAuth('JWT-auth')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('createProfile')
  @ApiOperation({ summary: 'Create user profile' })
  @ApiResponse({
    status: 201,
    description:
      'Profile created successfully with auto-calculated horoscope and zodiac',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Profile already exists' })
  async createProfile(
    @Request() req,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    return this.profileService.createProfile(req.user.userId, createProfileDto);
  }

  @Get('getProfile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getProfile(@Request() req) {
    return this.profileService.getProfile(req.user.userId);
  }

  @Put('updateProfile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: 200,
    description:
      'Profile updated successfully. Horoscope and zodiac auto-recalculated if birthday changed.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(req.user.userId, updateProfileDto);
  }

  // 🖼️ Upload Profile Image
  @Post('uploadProfileImage')
  @ApiOperation({ summary: 'Upload profile image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Profile image file (jpg, jpeg, png, gif, webp - max 5MB)',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Image uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file format or size' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadProfileImage(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return this.profileService.uploadProfileImage(
      req.user.userId,
      file.filename,
    );
  }

  // 🗑️ Delete Profile Image
  @Delete('deleteProfileImage')
  @ApiOperation({ summary: 'Delete profile image' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Profile or image not found' })
  async deleteProfileImage(@Request() req) {
    return this.profileService.deleteProfileImage(req.user.userId);
  }
}
