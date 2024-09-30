import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { 
  ConfigModule, 
  ConfigService 
} from '@nestjs/config';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { User, UserSchema } from '../user/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { LoggerService } from '../logger/logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_TOKEN_EXPIRY'),
        },
      })
    }),
  ],
  providers: [AuthService, UserService, LoggerService],
  controllers: [AuthController],
})
export class AuthModule {}