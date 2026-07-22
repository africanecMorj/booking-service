import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class SessionsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  create(data: {
    userId: string;
    jti: string;
    refreshHash: string;
    userAgent?: string;
    ip?: string;
    expiresAt: Date;
  }) {
    return this.prisma.session.create({
      data,
    });
  }

  findByJti(jti: string) {
    return this.prisma.session.findUnique({
      where: { jti },
    });
  }

  revoke(id: string) {
    return this.prisma.session.update({
      where: { id },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  revokeAll(userId: string) {
    return this.prisma.session.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }
}