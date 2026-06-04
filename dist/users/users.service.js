"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const role_enum_1 = require("./role.enum");
let UsersService = class UsersService {
    users = new Map();
    idCounter = 0;
    create(params) {
        const id = +this.idCounter;
        const user = {
            id,
            email: params['email'],
            passwordHash: params['passwordHash'],
            roles: params['roles'] ?? [role_enum_1.UserRole.User],
            hashedRefreshToken: null,
        };
        this.users.set(id, user);
        return user;
    }
    findByEmail(email) {
        return [...this.users.values()].find((user) => user.email === email);
    }
    findById(id) {
        return this.users.get(id);
    }
    setRefreshTokenHash(id, hash) {
        const user = this.findById(id);
        if (user) {
            user.hashedRefreshToken = hash;
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)()
], UsersService);
//# sourceMappingURL=users.service.js.map