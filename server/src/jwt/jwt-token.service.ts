import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { StringValue } from 'ms';

import { randomUUID } from 'crypto';

import { Role } from '@prisma/client';

import { readFileSync } from 'fs';
import { resolve } from 'path';

@Injectable()
export class JwtTokenService {
  private readonly privateKey: Buffer;
  private readonly publicKey: Buffer;

  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {
    this.privateKey = readFileSync(
      resolve(this.config.getOrThrow('JWT_PRIVATE_KEY')),
    );

    this.publicKey = readFileSync(
      resolve(this.config.getOrThrow('JWT_PUBLIC_KEY')),
    );
  }

  signAccess(userId: string, roles: Role[]) {
    return this.jwt.signAsync(
      {
        sub: userId,
        roles,
      },
      {
        algorithm: 'RS256',
        privateKey: this.privateKey,
        expiresIn: '15m',
      },
    );
  }

  async signRefresh(userId: string) {
    const jti = randomUUID();

    const token = await this.jwt.signAsync(
      {
        sub: userId,
        jti,
      },
      {
        algorithm: 'RS256',
        privateKey: this.privateKey,
        expiresIn: '30d',
      },
    );

    return { token, jti };
  }

  verifyAccess(token: string) {
    return this.jwt.verify(token, {
      algorithms: ['RS256'],
      publicKey: this.publicKey,
    });
  }

  verifyRefresh(token: string) {
    return this.jwt.verify(token, {
      algorithms: ['RS256'],
      publicKey: this.publicKey,
    });
  }
}

