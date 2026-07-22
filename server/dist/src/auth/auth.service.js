"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const argon2 = __importStar(require("argon2"));
const users_service_1 = require("../users/users.service");
const sessions_service_1 = require("../session/sessions.service");
const jwt_token_service_1 = require("../jwt/jwt-token.service");
let AuthService = class AuthService {
    users;
    sessions;
    jwt;
    constructor(users, sessions, jwt) {
        this.users = users;
        this.sessions = sessions;
        this.jwt = jwt;
    }
    async register(dto, req) {
        const exists = await this.users.findByEmail(dto.email);
        if (exists) {
            throw new common_1.ConflictException('Email already exists');
        }
        const passwordHash = await argon2.hash(dto.password);
        const user = await this.users.create({
            email: dto.email,
            passwordHash,
        });
        return this.issueTokens(user, req);
    }
    async login(dto, req) {
        const user = await this.users.findByEmail(dto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const ok = await argon2.verify(user.passwordHash, dto.password);
        if (!ok) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.issueTokens(user, req);
    }
    async refresh(refreshToken, req) {
        const payload = this.jwt.verifyRefresh(refreshToken);
        const session = await this.sessions.findByJti(payload.jti);
        if (!session) {
            throw new common_1.UnauthorizedException();
        }
        if (session.revokedAt) {
            throw new common_1.UnauthorizedException();
        }
        if (session.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException();
        }
        const valid = await argon2.verify(session.refreshHash, refreshToken);
        if (!valid) {
            throw new common_1.UnauthorizedException();
        }
        await this.sessions.revoke(session.id);
        const user = await this.users.findById(payload.sub);
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        return this.issueTokens(user, req);
    }
    async logout(sessionId) {
        await this.sessions.revoke(sessionId);
    }
    async logoutAll(userId) {
        await this.sessions.revokeAll(userId);
    }
    async issueTokens(user, req) {
        const accessToken = await this.jwt.signAccess(user.id, user.roles);
        const refresh = await this.jwt.signRefresh(user.id);
        const refreshHash = await argon2.hash(refresh.token);
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        sessions_service_1.SessionsService,
        jwt_token_service_1.JwtTokenService])
], AuthService);
//# sourceMappingURL=auth.service.js.map