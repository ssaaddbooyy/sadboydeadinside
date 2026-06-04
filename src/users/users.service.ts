import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UserRole } from './role.enum';

@Injectable()
export class UsersService {
    private readonly users=new Map<number, User>();
    private idCounter=0;

    create(params:{
        email:string;
        passwordHash:string;
        roles?:UserRole[];
    }):User{
        const id = +this.idCounter;
        const user:User={
            id,
            email: params['email'],
            passwordHash: params['passwordHash'],
            roles: params['roles'] ?? [UserRole.User],
            hashedRefreshToken: null,
        }

        this.users.set(id,user);
        return user;
    }

    findByEmail(email:string):User | undefined{
        return [...this.users.values()].find((user)=> user.email === email);
    }

    findById(id:number): User | undefined{
        return this.users.get(id);
    }

    setRefreshTokenHash(id:number, hash:string | null): void{
        const user = this.findById(id);

        if(user){
            user.hashedRefreshToken=hash;
        }
    }
}
