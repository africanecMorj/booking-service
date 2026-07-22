import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { AccessTokenPayload } from './types/access-token.payload';
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    register(dto: RegisterDto, req: Request): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    login(dto: LoginDto, req: Request): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(dto: RefreshDto, req: Request): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(user: AccessTokenPayload): Promise<void>;
}
