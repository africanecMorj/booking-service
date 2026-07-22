"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtTokenService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const path_1 = require("path");
let JwtTokenService = class JwtTokenService {
    jwt;
    config;
    privateKey;
    publicKey;
    constructor(jwt, config) {
        this.jwt = jwt;
        this.config = config;
        this.privateKey = (0, fs_1.readFileSync)((0, path_1.resolve)(this.config.getOrThrow('JWT_PRIVATE_KEY')));
        this.publicKey = (0, fs_1.readFileSync)((0, path_1.resolve)(this.config.getOrThrow('JWT_PUBLIC_KEY')));
    }
    signAccess(userId, roles) {
        return this.jwt.signAsync({
            sub: userId,
            roles,
        }, {
            algorithm: 'RS256',
            privateKey: this.privateKey,
            expiresIn: '15m',
        });
    }
    async signRefresh(userId) {
        const jti = (0, crypto_1.randomUUID)();
        const token = await this.jwt.signAsync({
            sub: userId,
            jti,
        }, {
            algorithm: 'RS256',
            privateKey: this.privateKey,
            expiresIn: '30d',
        });
        return { token, jti };
    }
    verifyAccess(token) {
        return this.jwt.verify(token, {
            algorithms: ['RS256'],
            publicKey: this.publicKey,
        });
    }
    verifyRefresh(token) {
        return this.jwt.verify(token, {
            algorithms: ['RS256'],
            publicKey: this.publicKey,
        });
    }
};
exports.JwtTokenService = JwtTokenService;
exports.JwtTokenService = JwtTokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], JwtTokenService);
//# sourceMappingURL=jwt-token.service.js.map