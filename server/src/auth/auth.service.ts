import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import * as argon2 from 'argon2';
import { Request } from 'express';

import { User } from '@prisma/client';

import { UsersService } from '../users/users.service';
import { SessionsService } from '../session/sessions.service';
import { JwtTokenService } from '../jwt/jwt-token.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly sessions: SessionsService,
    private readonly jwt: JwtTokenService,
  ) {}

  async register(
    dto: RegisterDto,
    req: Request,
  ) {
    const exists = await this.users.findByEmail(dto.email);

    if (exists) {
      throw new ConflictException('Email already exists');
    }

    const passwordHash = await argon2.hash(dto.password);

    const user = await this.users.create({
      email: dto.email,
      passwordHash,
    });

    return this.issueTokens(user, req);
  }

  async login(
    dto: LoginDto,
    req: Request,
  ) {
    const user = await this.users.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const ok = await argon2.verify(
      user.passwordHash,
      dto.password,
    );

    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issueTokens(user, req);
  }

  async refresh(
    refreshToken: string,
    req: Request,
  ) {
    const payload =
      this.jwt.verifyRefresh(refreshToken);

    const session =
      await this.sessions.findByJti(payload.jti);

    if (!session) {
      throw new UnauthorizedException();
    }

    if (session.revokedAt) {
      throw new UnauthorizedException();
    }

    if (session.expiresAt < new Date()) {
      throw new UnauthorizedException();
    }

    const valid = await argon2.verify(
      session.refreshHash,
      refreshToken,
    );

    if (!valid) {
      throw new UnauthorizedException();
    }

    await this.sessions.revoke(session.id);

    const user = await this.users.findById(
      payload.sub,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.issueTokens(user, req);
  }

  async logout(sessionId: string) {
    await this.sessions.revoke(sessionId);
  }

  async logoutAll(userId: string) {
    await this.sessions.revokeAll(userId);
  }

  private async issueTokens(
    user: User,
    req: Request,
  ) {
    const accessToken =
      await this.jwt.signAccess(
        user.id,
        user.roles,
      );

    const refresh =
      await this.jwt.signRefresh(user.id);

    const refreshHash =
      await argon2.hash(refresh.token);

    const expiresAt = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000,
    );

    await this.sessions.create({
      userId: user.id,
      jti: refresh.jti,
      refreshHash,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken: refresh.token,
    };
  }
}

