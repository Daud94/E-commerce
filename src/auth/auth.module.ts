import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { UserAuthController } from './controllers/user-auth.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UsersModule],
  providers: [JwtService],
  controllers: [UserAuthController],
  exports: [JwtService],
})
export class AuthModule {}
