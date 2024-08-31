import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { UsersManagementService } from './users-management.service';
import { UserQueryDto } from '../../users/dtos/user-query.dto';

@Controller({ path: 'admin/users-management', version: '1' })
export class UsersManagementController {
  constructor(
    private readonly usersManagementService: UsersManagementService,
  ) {}

  @Get('users')
  async viewAllUsers(@Query() query: UserQueryDto) {
    const data = await this.usersManagementService.viewAllUsers(query);
    return {
      success: true,
      message: 'Users fetched',
      data: data.rows,
      metadata: data.metadata,
    };
  }

  @Get('users/:id')
  async viewUser(@Param('id', ParseIntPipe) id: number) {
    const data = await this.usersManagementService.viewUser(id);
    return {
      success: true,
      message: 'User details fetched',
      data: data,
    };
  }

  @Patch('users/:id/suspend')
  async suspendUser(@Param('id', ParseIntPipe) id: number) {
    const data = await this.usersManagementService.suspendUser(id);
    return {
      success: true,
      message: 'User suspended',
      data: data,
    };
  }

  @Patch('users/:id/unsuspend')
  async unsuspendUser(@Param('id', ParseIntPipe) id: number) {
    const data = await this.usersManagementService.unsuspendUser(id);
    return {
      success: true,
      message: 'Suspension removed',
      data: data,
    };
  }
}
