import {
  Controller,
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
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin[Users Management]')
@Controller({ path: 'admin/users-management', version: '1' })
export class UsersManagementController {
  constructor(
    private readonly usersManagementService: UsersManagementService,
  ) {}

  @HttpCode(HttpStatus.OK)
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
}
