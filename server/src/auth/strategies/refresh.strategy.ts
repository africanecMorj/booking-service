import { Injectable } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';

import {
  Strategy,
  ExtractJwt,
} from 'passport-jwt';

import { ConfigService } from '@nestjs/config';

import { readFileSync } from 'fs';

@Injectable()
export class RefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    config: ConfigService,
  ) {
    super({
      jwtFromRequest:
        ExtractJwt.fromBodyField(
          'refreshToken',
        ),

      ignoreExpiration: false,

      algorithms: ['RS256'],

      secretOrKey: readFileSync(
        config.getOrThrow('JWT_PUBLIC_KEY'),
      ),

      passReqToCallback: true,
    });
  }

  validate(
    req: Request,
    payload: any,
  ) {
    return {
      ...payload,
      refreshToken:
        (req.body as any).refreshToken,
    };
  }
}