import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from 'auth/guards/access-token.guard';

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}),UsersModule, AuthModule],
  providers: [{provide:APP_GUARD, useClass:AccessTokenGuard}],
})
export class AppModule {}
