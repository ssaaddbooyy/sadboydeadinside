import {Body,Controller,HttpCode,HttpStatus,Post,Request,UseGuards,} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RegisterDto } from "../dto/register.dto";
import { LoginDto } from "../dto/login.dto";
import { AuthService, Tokens } from "../services/auth.service";
import { Public } from "../decorators/public.decorator";
import { JwtPayload, JwtPayloadWithRefresh } from "../types/auth.types";
 
@Controller("auth")
export class AuthController{
constructor(private readonly authService:AuthService){}
 
    @Post("register")
    @Public()
    register(@Body() dto:RegisterDto):Promise<Tokens>{
        return this.authService.register(dto);
    }
 
    @Post("login")
    @Public()
    @HttpCode(HttpStatus.OK)
    login(@Body() dto:LoginDto):Promise<Tokens>{
        return this.authService.login(dto);
    }
 
    @Post("logout")
    @UseGuards(AuthGuard("jwt"))
    @HttpCode(HttpStatus.NO_CONTENT)
    logout(@Request() request):Promise<void>{
        const user=request.user as JwtPayload;
        return this.authService.logout(user.sub);
    }
 
    @Post("refresh")
    @UseGuards(AuthGuard("jwt-refresh"))
    @HttpCode(HttpStatus.OK)
    refresh(@Request() request):Promise<Tokens>{
        const user=request.user as JwtPayloadWithRefresh;
        return this.authService.refresh(user.sub,user.refreshToken);
    }
 
    @Post("verify-email")
    @UseGuards(AuthGuard("jwt"))
    @HttpCode(HttpStatus.NO_CONTENT)
    verifyEmail(@Request() request):Promise<void>{
        const user=request.user as JwtPayload;
        return this.authService.verifyEmail(user.sub);
    }
 
    @Post("forgot-password")
    @Public()
    @HttpCode(HttpStatus.NO_CONTENT)
    forgotPassword(@Body("email") email:string):Promise<void>{
        return this.authService.forgotPassword(email);
    }
}