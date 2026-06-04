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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../../users/users.service");
const bcrypt_1 = require("bcrypt");
const role_enum_1 = require("../../users/role.enum");
const crypto_1 = require("crypto");
let AuthService = AuthService_1 = class AuthService {
    users;
    jwt;
    config;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(users, jwt, config) {
        this.users = users;
        this.jwt = jwt;
        this.config = config;
    }
    async register(dto) {
        if (this.users.findByEmail(dto.email)) {
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                errors: {
                    email: "emailAlreadyExists",
                },
            });
        }
        const passwordHash = await (0, bcrypt_1.hash)(dto.password, 10);
        const user = this.users.create({
            email: dto['email'],
            passwordHash,
            roles: [role_enum_1.UserRole.User]
        });
        return this.issueTokens(user['id'], user['email'], user['roles']);
    }
    async login(dto) {
        const user = this.users.findByEmail(dto.email);
        if (!user) {
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                errors: {
                    email: "notFound",
                },
            });
        }
        const isValidPassword = await (0, bcrypt_1.compare)(dto.password, user.passwordHash);
        if (!isValidPassword) {
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                errors: {
                    password: "incorrectPassword",
                },
            });
        }
        return this.issueTokens(user['id'], user['email'], user['roles']);
    }
    async logout(userId) {
        this.users.setRefreshTokenHash(userId, null);
    }
    async refresh(userId, refreshToken) {
        const user = this.users.findById(userId);
        if (!user || !user.hashedRefreshToken) {
            throw new common_1.UnauthorizedException();
        }
        const tokenMatch = this.hashToken(refreshToken) === user.hashedRefreshToken;
        if (!tokenMatch) {
            throw new common_1.UnauthorizedException();
        }
        return this.issueTokens(user['id'], user['email'], user['roles']);
    }
    async verifyEmail(userId) {
        this.logger.log(`Email successfully verified for user id=${userId}`);
    }
    async forgotPassword(email) {
        const newPassword = (0, crypto_1.randomUUID)().slice(0, 12);
        this.logger.log(`New password sent to ${email}: ${newPassword}`);
    }
    async issueTokens(userId, email, roles) {
        const payload = { sub: userId, email, roles };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwt.signAsync(payload, {
                secret: this.config.getOrThrow("JWT_ACCESS_SECRET"),
                expiresIn: this.config.getOrThrow("JWT_ACCESS_EXPIRES_IN"),
                jwtid: (0, crypto_1.randomUUID)(),
            }),
            this.jwt.signAsync(payload, {
                secret: this.config.getOrThrow("JWT_REFRESH_SECRET"),
                expiresIn: this.config.getOrThrow("JWT_REFRESH_EXPIRES_IN"),
                jwtid: (0, crypto_1.randomUUID)(),
            })
        ]);
        this.users.setRefreshTokenHash(userId, this.hashToken(refreshToken));
        return { accessToken, refreshToken };
    }
    hashToken(token) {
        return (0, crypto_1.createHash)("sha256").update(token).digest("hex");
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map