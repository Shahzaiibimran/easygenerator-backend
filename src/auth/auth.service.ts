import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto, SignInDto } from './auth.dto';
import { sendResponse } from '../utils/response.util';
import { apiResponse } from '../interfaces/api_response.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<apiResponse> {
    const { email, password } = signUpDto;

    const user = await this.userService.findUserByEmail(email);
    
    if (user) {
      return sendResponse(HttpStatus.BAD_REQUEST, [{ email: ['Email has already been exists']} ]);
    }

    const salt = await bcrypt.genSalt();
    
    const hashedPassword = await bcrypt.hash(password, salt);

    await this.userService.createUser(signUpDto, hashedPassword);

    return sendResponse(HttpStatus.CREATED);
  }

  async signIn(signInDto: SignInDto): Promise<apiResponse> {
    const { email, password } = signInDto;

    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      return sendResponse(HttpStatus.UNAUTHORIZED, [{ email: ['Email is invalid'] }]);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return sendResponse(HttpStatus.UNAUTHORIZED, [{ password: ['Password is invalid'] }]);
    }

    const payload = { email: user.email };
    
    const accessToken = this.jwtService.sign(payload);

    return sendResponse(HttpStatus.OK, [], { access_token: accessToken, email: email });
  }
}