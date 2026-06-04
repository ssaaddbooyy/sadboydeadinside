import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../../users/users.service";
import { RegisterDto } from "../dto/register.dto";
import { LoginDto } from "../dto/login.dto";
export interface Tokens {
    accessToken: string;
    refreshToken: string;
}
export declare class AuthService {
    private readonly users;
    private readonly jwt;
    private readonly config;
    private readonly logger;
    constructor(users: UsersService, jwt: JwtService, config: ConfigService);
    register(dto: RegisterDto): Promise<Tokens>;
    login(dto: LoginDto): Promise<Tokens>;
    logout(userId: number): Promise<void>;
    refresh(userId: number, refreshToken: string): Promise<Tokens>;
    verifyEmail(userId: number): Promise<void>;
    forgotPassword(email: string): Promise<void>;
    private issueTokens;
    private hashToken;
}
