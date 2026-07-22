import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { SessionsService } from '../session/sessions.service';
import { JwtTokenService } from '../jwt/jwt-token.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly users;
    private readonly sessions;
    private readonly jwt;
    constructor(users: UsersService, sessions: SessionsService, jwt: JwtTokenService);
    register(dto: RegisterDto, req: Request): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    login(dto: LoginDto, req: Request): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(refreshToken: string, req: Request): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(sessionId: string): Promise<void>;
    logoutAll(userId: string): Promise<void>;
    private issueTokens;
}
