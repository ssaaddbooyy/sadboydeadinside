import { UserRole } from "./role.enum";

export interface User{
    id:number;
    email:string;
    roles:UserRole[];
    passwordHash: string;
    hashedRefreshToken: string | null;
}
