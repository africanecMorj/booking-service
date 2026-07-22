import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '../users/users.module';
import { SessionsModule } from '../session/session.module';
import { JwtTokenModule } from '../jwt/jwt.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { AccessStrategy } from './strategies/access.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';


@Module({
  imports: [
    UsersModule,
    SessionsModule,
    JwtTokenModule,

    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessStrategy,
    RefreshStrategy,
  ],
  exports: [
    PassportModule,
  ],
})
export class AuthModule {}