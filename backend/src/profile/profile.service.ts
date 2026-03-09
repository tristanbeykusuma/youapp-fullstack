/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from '../schemas/profile.schema';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AstrologyUtil } from '../common/utils/astrology.util';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {}

  async createProfile(userId: string, createProfileDto: CreateProfileDto) {
    // Check if profile already exists
    const existingProfile = await this.profileModel.findOne({ userId });
    if (existingProfile) {
      throw new ConflictException('Profile already exists for this user');
    }

    // Convert birthday string to Date
    const birthday = new Date(createProfileDto.birthday);

    // 🌟 AUTO-CALCULATE horoscope and zodiac
    const horoscope = AstrologyUtil.calculateHoroscope(birthday);
    const zodiac = AstrologyUtil.calculateZodiac(birthday.getFullYear());

    // Create profile with calculated values
    const profile = new this.profileModel({
      userId,
      ...createProfileDto,
      birthday,
      horoscope,
      zodiac,
    });

    await profile.save();

    return {
      message: 'Profile created successfully',
      data: this.formatProfileResponse(profile),
    };
  }

  async getProfile(userId: string) {
    const profile = await this.profileModel
      .findOne({ userId })
      .populate('userId', 'email username');

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return {
      data: this.formatProfileResponse(profile),
    };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const profile = await this.profileModel.findOne({ userId });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // Update only fields that are provided in the DTO
    if (updateProfileDto.displayName !== undefined) {
      profile.displayName = updateProfileDto.displayName;
    }
    if (updateProfileDto.gender !== undefined) {
      profile.gender = updateProfileDto.gender;
    }
    if (updateProfileDto.birthday !== undefined) {
      const birthday = new Date(updateProfileDto.birthday);
      profile.birthday = birthday;
      // 🌟 Recalculate horoscope and zodiac if birthday is updated
      profile.horoscope = AstrologyUtil.calculateHoroscope(birthday);
      profile.zodiac = AstrologyUtil.calculateZodiac(birthday.getFullYear());
    }
    if (updateProfileDto.height !== undefined) {
      profile.height = updateProfileDto.height;
    }
    if (updateProfileDto.weight !== undefined) {
      profile.weight = updateProfileDto.weight;
    }
    if (updateProfileDto.interests !== undefined) {
      profile.interests = updateProfileDto.interests;
    }
    if (updateProfileDto.about !== undefined) {
      profile.about = updateProfileDto.about;
    }
    if (updateProfileDto.profileImage !== undefined) {
      profile.profileImage = updateProfileDto.profileImage;
    }

    await profile.save();

    return {
      message: 'Profile updated successfully',
      data: this.formatProfileResponse(profile),
    };
  }

  // 🖼️ Upload profile image
  async uploadProfileImage(userId: string, filename: string) {
    const profile = await this.profileModel.findOne({ userId });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // Delete old image if exists
    if (profile.profileImage) {
      const oldImagePath = path.join(
        process.cwd(),
        'uploads',
        'profiles',
        path.basename(profile.profileImage),
      );

      if (fs.existsSync(oldImagePath)) {
        try {
          fs.unlinkSync(oldImagePath);
        } catch (error) {
          console.error('Failed to delete old image:', error);
        }
      }
    }

    // Save new image URL (relative path)
    profile.profileImage = `/uploads/profiles/${filename}`;
    await profile.save();

    return {
      message: 'Profile image uploaded successfully',
      data: this.formatProfileResponse(profile),
    };
  }

  // 🗑️ Delete profile image
  async deleteProfileImage(userId: string) {
    const profile = await this.profileModel.findOne({ userId });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    if (!profile.profileImage) {
      throw new NotFoundException('No profile image to delete');
    }

    // Delete image file
    const imagePath = path.join(
      process.cwd(),
      'uploads',
      'profiles',
      path.basename(profile.profileImage),
    );

    if (fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
      } catch (error) {
        console.error('Failed to delete image file:', error);
      }
    }

    // Remove image URL from profile
    profile.profileImage = null;
    await profile.save();

    return {
      message: 'Profile image deleted successfully',
      data: this.formatProfileResponse(profile),
    };
  }

  // 🗑️ Delete profile by userId (called from auth service when deleting account)
  async deleteProfileByUserId(userId: string) {
    const profile = await this.profileModel.findOne({ userId });

    if (profile) {
      // Delete profile image if exists
      if (profile.profileImage) {
        const imagePath = path.join(
          process.cwd(),
          'uploads',
          'profiles',
          path.basename(profile.profileImage),
        );

        if (fs.existsSync(imagePath)) {
          try {
            fs.unlinkSync(imagePath);
          } catch (error) {
            console.error('Failed to delete profile image:', error);
          }
        }
      }

      await this.profileModel.deleteOne({ userId });
    }
  }

  private formatProfileResponse(profile: any) {
    // Calculate age dynamically
    const age = profile.birthday
      ? AstrologyUtil.calculateAge(profile.birthday)
      : null;

    return {
      displayName: profile.displayName,
      gender: profile.gender,
      birthday: profile.birthday,
      age, // Dynamic age
      horoscope: profile.horoscope,
      zodiac: profile.zodiac,
      height: profile.height,
      weight: profile.weight,
      interests: profile.interests || [],
      about: profile.about,
      profileImage: profile.profileImage,
    };
  }
}
