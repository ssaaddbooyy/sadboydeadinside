import { User } from './user.entity';
import { UserRole } from './role.enum';
export declare class UsersService {
    private readonly users;
    private idCounter;
    create(params: {
        email: string;
        passwordHash: string;
        roles?: UserRole[];
    }): User;
    findByEmail(email: string): User | undefined;
    findById(id: number): User | undefined;
    setRefreshTokenHash(id: number, hash: string | null): void;
}
