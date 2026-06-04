import { UserRole } from "../../users/role.enum";
export interface JwtPayload {
    sub: number;
    email: string;
    roles: UserRole[];
}
export interface JwtPayloadWithRefresh extends JwtPayload {
    refreshToken: string;
}
