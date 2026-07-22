import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Get,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { AuthService } from './auth.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { AccessTokenPayload } from './types/access-token.payload';
import { JwtAuthGuard  } from './guards/jwtAuth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
  ) {}

  @Post('register')
  register(
    @Body() dto: RegisterDto,
    @Req() req: Request,
  ) {
    return this.auth.register(dto, req);
  }

  @HttpCode(200)
  @Post('login')
  login(
    @Body() dto: LoginDto,
    @Req() req: Request,
  ) {
    return this.auth.login(dto, req);
  }

  @HttpCode(200)
  @Post('refresh')
  refresh(
    @Body() dto: RefreshDto,
    @Req() req: Request,
  ) {
    return this.auth.refresh(
      dto.refreshToken,
      req,
    );
  }

  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(
    @CurrentUser() user: AccessTokenPayload,
  ) {
    return this.auth.logout(user.sub);
  }
}