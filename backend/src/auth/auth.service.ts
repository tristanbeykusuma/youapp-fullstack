import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, username, password, confirmPassword } = registerDto;

    // Step 1: Check if passwords match
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Step 2: Check if email already exists
    const existingEmail = await this.userModel.findOne({ email });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    // Step 3: Check if username already exists
    const existingUsername = await this.userModel.findOne({ username });
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    // Step 4: Hash password (10 salt rounds)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Step 5: Create user
    const user = new this.userModel({
      email,
      username,
      password: hashedPassword,
    });

    await user.save();

    // Step 6: Return success (don't send password back!)
    return {
      message: 'User registered successfully',
      data: {
        userId: user._id,
        email: user.email,
        username: user.username,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Step 1: Find user by email OR username
    const user = await this.userModel.findOne({
      $or: [{ email }, { username: email }],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Step 2: Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Step 3: Update last login
    user.lastLogin = new Date();
    await user.save();

    // Step 4: Generate JWT token
    const payload = {
      sub: user._id,
      email: user.email,
      username: user.username,
    };
    const accessToken = this.jwtService.sign(payload);

    // Step 5: Return token and user data
    return {
      message: 'Login successful',
      data: {
        accessToken,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
        },
      },
    };
  }

  async deleteAccount(userId: string) {
    // Find user
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userModel.findByIdAndDelete(userId);

    return {
      message: 'Account deleted successfully',
      data: {
        userId,
        email: user.email,
        deletedAt: new Date(),
      },
    };
  }
}
