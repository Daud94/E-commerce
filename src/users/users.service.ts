import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { AddUserDto } from './dtos/add-user.dto';
import * as bcrypt from 'bcrypt';
import { UsersStatus } from './enums/users-status.enum';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { Op } from 'sequelize';
import { PageMetaDto } from '../common/dtos/page-meta.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  async findUserById(id: number) {
    return await User.findByPk(id);
  }

  async addUser(request: AddUserDto) {
    const passwordHash = await bcrypt.hash(
      request.password,
      +process.env['SALT_OR_ROUNDS'],
    );
    await this.userModel.create({
      ...request,
      password: passwordHash,
      status: UsersStatus.PENDING,
    });
  }

  async changeUserStatus(id: number, status: UsersStatus) {
    const existingUser = await this.findUserById(id);
    if (!existingUser) throw new NotFoundException('User not found');
    await existingUser.update({ status: status });
  }

  async updateUser(id: number, request: Partial<User>) {
    const existingUser = await this.findUserById(id);
    if (!existingUser) throw new NotFoundException('User not found');
    await existingUser.update({ ...request });
  }

  async getAllUsers(query: PageOptionsDto) {
    const { rows, count } = await this.userModel.findAndCountAll({
      where: {
        ...(query.searchTerm && {
          [Op.or]: [
            {
              firstName: {
                [Op.iLike]: `%${query.searchTerm}`,
              },
            },
            {
              lastName: {
                [Op.iLike]: `%${query.searchTerm}`,
              },
            },
            {
              email: {
                [Op.iLike]: `%${query.searchTerm}`,
              },
            },
          ],
        }),
        ...(query.status && { status: query.status }),
      },
    });

    const metadata = new PageMetaDto({
      pageOptionsDto: query,
      itemCount: count,
    });

    return {
      rows,
      metadata,
    };
  }

  async deleteUser(id: number) {
    const existingUser = await this.findUserById(id);
    if (!existingUser) throw new NotFoundException('User not found');
    await existingUser.destroy();
  }
}
