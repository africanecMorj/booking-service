import { PrismaService } from '../prisma/prisma.service';
export declare class SessionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: {
        userId: string;
        jti: string;
        refreshHash: string;
        userAgent?: string;
        ip?: string;
        expiresAt: Date;
    }): import(".prisma/client").Prisma.Prisma__SessionClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        jti: string;
        refreshHash: string;
        userAgent: string | null;
        ip: string | null;
        expiresAt: Date;
        revokedAt: Date | null;
        userId: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findByJti(jti: string): import(".prisma/client").Prisma.Prisma__SessionClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        jti: string;
        refreshHash: string;
        userAgent: string | null;
        ip: string | null;
        expiresAt: Date;
        revokedAt: Date | null;
        userId: string;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    revoke(id: string): import(".prisma/client").Prisma.Prisma__SessionClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        jti: string;
        refreshHash: string;
        userAgent: string | null;
        ip: string | null;
        expiresAt: Date;
        revokedAt: Date | null;
        userId: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    revokeAll(userId: string): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
}
