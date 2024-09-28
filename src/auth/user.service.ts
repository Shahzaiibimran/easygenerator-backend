import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/user.schema';
import { SignUpDto } from '../auth/auth.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(signUpDto: SignUpDto, hashedPassword: string): Promise<User> {
    const { 
      name, 
      email 
    } = signUpDto;

    const user = new this.userModel({ 
      name, 
      email, 
      password: hashedPassword 
    });

    return user.save();
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }
}