import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { UserQueryDto } from '../../users/dtos/user-query.dto';
import { UsersStatus } from '../../users/enums/users-status.enum';

@Injectable()
export class UsersManagementService {
  constructor(private readonly usersService: UsersService) {}

  async viewAllUsers(query: UserQueryDto) {
    return await this.usersService.getAllUsers(query);
  }

  async viewUser(userId: number) {
    return await this.usersService.findUserById(userId);
  }

  async suspendUser(userId: number) {
    return await this.usersService.changeUserStatus(
      userId,
      UsersStatus.SUSPENDED,
    );
  }

  async unsuspendUser(userId: number) {
    return await this.usersService.changeUserStatus(
      userId,
      UsersStatus.APPROVED,
    );
  }

  async deleteUser(userId: number) {
    return await this.usersService.deleteUser(userId);
  }
}
