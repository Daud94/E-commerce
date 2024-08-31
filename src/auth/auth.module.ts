import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { UserAuthController } from './controllers/user-auth.controller';
import { JwtService } from '@nestjs/jwt';
import { AdminAuthController } from './controllers/admin-auth.controller';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [UsersModule, AdminModule],
  providers: [JwtService],
  controllers: [UserAuthController, AdminAuthController],
  exports: [JwtService],
})
export class AuthModule {}
