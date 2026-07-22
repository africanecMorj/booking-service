import { Injectable } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';

import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

import { ConfigService } from '@nestjs/config';

import { readFileSync } from 'fs';

@Injectable()
export class AccessStrategy extends PassportStrategy(
  Strategy,
  'jwt',
) {
  constructor(
    config: ConfigService,
  ) {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      algorithms: ['RS256'],

      secretOrKey: readFileSync(
        config.getOrThrow('JWT_PUBLIC_KEY'),
      ),
    });
  }

  validate(payload: any) {
    return payload;
  }
}