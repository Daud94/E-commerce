import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Admin } from './admin.model';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { JwtService } from '@nestjs/jwt';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';
import { UsersManagementController } from './users management/users-management.controller';
import { UsersManagementService } from './users management/users-management.service';

@Module({
  imports: [SequelizeModule.forFeature([Admin]), ProductsModule, UsersModule],
  providers: [AdminService, JwtService, UsersManagementService],
  controllers: [AdminController, UsersManagementController],
  exports: [AdminService],
})
export class AdminModule {}
