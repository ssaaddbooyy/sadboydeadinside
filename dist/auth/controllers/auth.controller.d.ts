import { RegisterDto } from "../dto/register.dto";
import { LoginDto } from "../dto/login.dto";
import { AuthService, Tokens } from "../services/auth.service";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<Tokens>;
    login(dto: LoginDto): Promise<Tokens>;
    logout(request: any): Promise<void>;
    refresh(request: any): Promise<Tokens>;
    verifyEmail(request: any): Promise<void>;
    forgotPassword(email: string): Promise<void>;
}
