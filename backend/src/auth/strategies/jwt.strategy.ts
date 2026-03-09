import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';

interface JwtPayload {
  sub: string;
  email: string;
  username: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your-secret-key',
    });
  }

  async validate(payload: JwtPayload) {
    console.log('JWT Payload:', payload); // Add this for debugging

    const user = await this.userModel.findById(payload.sub);

    if (!user) {
      console.log('User not found for ID:', payload.sub); // Add this
      throw new UnauthorizedException('User not found');
    }

    console.log('User authenticated:', user.email); // Add this

    return {
      userId: user._id,
      email: user.email,
      username: user.username,
    };
  }
}
