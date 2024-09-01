import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersManagementService } from './users-management.service';
import { UserQueryDto } from '../../users/dtos/user-query.dto';
import { AdminAuthGuard } from '../../auth/guards/admin-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/role.enum';

@ApiBearerAuth('admin-auth')
@ApiTags('Admin[Users Management]')
@Controller({ path: 'admin/users-management', version: '1' })
export class UsersManagementController {
  constructor(
    private readonly usersManagementService: UsersManagementService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @UseGuards(AdminAuthGuard)
  @Get('users')
  async viewAllUsers(@Query() query: UserQueryDto) {
    try {
      const data = await this.usersManagementService.viewAllUsers(query);
      return {
        success: true,
        message: 'Users fetched',
        data: data.rows,
        metadata: data.metadata,
      };
    } catch (e) {
      throw new HttpException(e.response.message, e.status);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @UseGuards(AdminAuthGuard)
  @Get('users/:id')
  async viewUser(@Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.usersManagementService.viewUser(id);
      return {
        success: true,
        message: 'User details fetched',
        data: data,
      };
    } catch (e) {
      throw new HttpException(e.response.message, e.status);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @UseGuards(AdminAuthGuard)
  @Patch('users/:id/suspend')
  async suspendUser(@Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.usersManagementService.suspendUser(id);
      return {
        success: true,
        message: 'User suspended',
        data: data,
      };
    } catch (e) {
      throw new HttpException(e.response.message, e.status);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @UseGuards(AdminAuthGuard)
  @Patch('users/:id/unsuspend')
  async unsuspendUser(@Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.usersManagementService.unsuspendUser(id);
      return {
        success: true,
        message: 'Suspension removed',
        data: data,
      };
    } catch (e) {
      throw new HttpException(e.response.message, e.status);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Roles(...Object.values(Role))
  @UseGuards(AdminAuthGuard)
  @Delete('users/:id')
  async deleteUserAccount(@Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.usersManagementService.deleteUser(id);
      return {
        success: true,
        message: 'User deleted',
        data: data,
      };
    } catch (e) {
      throw new HttpException(e.response.message, e.status);
    }
  }
}
