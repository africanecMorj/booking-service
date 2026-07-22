import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
export declare class JwtTokenService {
    private readonly jwt;
    private readonly config;
    private readonly privateKey;
    private readonly publicKey;
    constructor(jwt: JwtService, config: ConfigService);
    signAccess(userId: string, roles: Role[]): Promise<string>;
    signRefresh(userId: string): Promise<{
        token: string;
        jti: `${string}-${string}-${string}-${string}-${string}`;
    }>;
    verifyAccess(token: string): any;
    verifyRefresh(token: string): any;
}
