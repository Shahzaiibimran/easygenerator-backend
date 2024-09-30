import { 
  Injectable 
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { HttpStatus } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { 
  SignUpDto, 
  SignInDto 
} from './auth.dto';
import { sendResponse } from '../utils/response.util';
import { apiResponse } from '../interfaces/api_response.interface';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly logger: LoggerService
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<apiResponse> {
    const { 
      email, 
      password 
    } = signUpDto;

    const user = await this.userService.findUserByEmail(email);

    this.logger.log(`Check Email: ${user}`, 'AuthService');
    
    if (user) {
      this.logger.warn(`${email} has already been exists`, 'AuthService');

      return sendResponse(HttpStatus.BAD_REQUEST, [{ email: ['Email has already been exists']} ]);
    }

    this.logger.log('Hashing the password', 'AuthService');

    const salt = await bcrypt.genSalt();
    
    const hashedPassword = await bcrypt.hash(password, salt);

    this.logger.log('Creating User', 'AuthService');

    await this.userService.createUser(signUpDto, hashedPassword);

    this.logger.log(`User Created ${email}`, 'AuthService');

    return sendResponse(HttpStatus.CREATED);
  }

  async signIn(signInDto: SignInDto): Promise<apiResponse> {
    const { 
      email, 
      password 
    } = signInDto;

    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      this.logger.warn(`The following email ${email} is invalid`, 'AuthService');

      return sendResponse(HttpStatus.UNAUTHORIZED, [{ email: ['Email is invalid'] }]);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      this.logger.warn(`The following email ${email} password is invalid`, 'AuthService');

      return sendResponse(HttpStatus.UNAUTHORIZED, [{ password: ['Password is invalid'] }]);
    }

    const payload = { email: user.email };
    
    const accessToken = this.jwtService.sign(payload);

    this.logger.log('Bearer token has been generated', 'AuthService');

    return sendResponse(HttpStatus.OK, [], { 
      access_token: accessToken, 
      email: email 
    });
  }
}