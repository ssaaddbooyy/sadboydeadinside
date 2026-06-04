import {HttpStatus,Injectable,Logger,UnauthorizedException,UnprocessableEntityException,} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "users/users.service";
import { RegisterDto } from "../dto/register.dto";
import { LoginDto } from "../dto/login.dto";
import { hash, compare } from "bcrypt";
import { UserRole } from "users/role.enum";
import { JwtPayload } from "../types/auth.types";
import { createHash, randomUUID } from "crypto";
 
export interface Tokens{
    accessToken:string;
    refreshToken:string;
}
 
@Injectable()
export class AuthService{
private readonly logger=new Logger(AuthService.name);
 
constructor(
    private readonly users:UsersService,
    private readonly jwt:JwtService,
    private readonly config:ConfigService,
){}
 
async register(dto:RegisterDto):Promise<Tokens>{
    if (this.users.findByEmail(dto.email)){
        throw new UnprocessableEntityException({
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors:{
                email:"emailAlreadyExists",
            },
        });
    }
 
    const passwordHash=await hash(dto.password,10);
    const user=this.users.create({
        email:dto['email'],
        passwordHash,
        roles:[UserRole.User]
    });
 
    return this.issueTokens(user['id'],user['email'],user['roles'])
}
 
async login(dto:LoginDto):Promise<Tokens>{
    const user=this.users.findByEmail(dto.email);
 
    if (!user){
        throw new UnprocessableEntityException({
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors:{
                email:"notFound",
            },
        });
    }
 
    const isValidPassword=await compare(dto.password,user.passwordHash);
    if (!isValidPassword){
        throw new UnprocessableEntityException({
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors:{
                password:"incorrectPassword",
            },
        });
    }
 
    return this.issueTokens(user['id'],user['email'],user['roles'])
}
 
async logout(userId:number):Promise<void>{
    this.users.setRefreshTokenHash(userId,null);
}
 
async refresh(userId:number, refreshToken:string):Promise<Tokens>{
    const user=this.users.findById(userId);
 
    if (!user || !user.hashedRefreshToken){
        throw new UnauthorizedException();
    }
 
    const tokenMatch=this.hashToken(refreshToken)===user.hashedRefreshToken;
    if (!tokenMatch){
        throw new UnauthorizedException();
    }
 
    return this.issueTokens(user['id'],user['email'],user['roles'])
}
 
async verifyEmail(userId:number):Promise<void>{
    this.logger.log(`Email successfully verified for user id=${userId}`);
}
 
async forgotPassword(email:string):Promise<void>{
    const newPassword=randomUUID().slice(0,12);
    this.logger.log(`New password sent to ${email}: ${newPassword}`);
}
 
private async issueTokens(userId:number, email:string, roles:UserRole[]):Promise<Tokens>{
    const payload:JwtPayload={sub:userId, email, roles};
 
    const [accessToken, refreshToken]=await Promise.all([
        this.jwt.signAsync(payload,{
            secret: this.config.getOrThrow("JWT_ACCESS_SECRET"),
            expiresIn: this.config.getOrThrow("JWT_ACCESS_EXPIRES_IN"),
            jwtid: randomUUID(),
        }),
        this.jwt.signAsync(payload,{
            secret: this.config.getOrThrow("JWT_REFRESH_SECRET"),
            expiresIn: this.config.getOrThrow("JWT_REFRESH_EXPIRES_IN"),
            jwtid: randomUUID(),
        })
    ]);
 
    this.users.setRefreshTokenHash(userId,this.hashToken(refreshToken));
 
    return{accessToken, refreshToken}
}
 
private hashToken(token:string):string{
    return createHash("sha256").update(token).digest("hex");
}
 
}