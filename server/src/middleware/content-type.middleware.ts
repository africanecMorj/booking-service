import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ContentTypeMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction) {
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      const contentType = req.headers['content-type'];

      if (!contentType) {
        throw new BadRequestException('Content-Type header is required');
      }

      if (!contentType.startsWith('application/json')) {
        throw new UnsupportedMediaTypeException(
          'Only application/json is supported',
        );
      }
    }

    next();
  }
}