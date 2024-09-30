import { 
  Controller, 
  Post, 
  Body, 
  Res 
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { 
  SignUpDto, 
  SignInDto 
} from './auth.dto';
import { LoggerService } from '../logger/logger.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly logger: LoggerService
  ) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto, @Res() res: Response): Promise<any> {
    this.logger.log('Sign up request received', 'AuthService');

    try {
      const {
        statusCode,
        message,
        errors,
        data
      } = await this.authService.signUp(signUpDto);
      
      return res.status(statusCode).json({
        status_code: statusCode,
        message,
        errors,
        data
      });
    } catch (error) {
      throw error;
    }
  }

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response): Promise<any> {
    this.logger.log('Sign in request received', 'AuthService');
    
    try {
      const {
        statusCode,
        message,
        errors,
        data
      } = await this.authService.signIn(signInDto);

      return res.status(statusCode).json({
        status_code: statusCode,
        message,
        errors,
        data
      });
    } catch (error) {
      throw error;
    }
  }
}