import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GithubStrategy } from './github.strategy';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'github' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Use a strong secret in production!
      signOptions: { expiresIn: '1h' }, // Token expiration time
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, GithubStrategy, JwtStrategy, JwtAuthGuard],
  exports: [AuthService],
})
export class AuthModule { }
