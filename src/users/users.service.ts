import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { AddUserDto } from './dtos/add-user.dto';
import * as bcrypt from 'bcrypt';
import { UsersStatus } from './enums/users-status.enum';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { Op } from 'sequelize';
import { PageMetaDto } from '../common/dtos/page-meta.dto';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly jwtService: JwtService,
  ) {}

  async findUserById(id: number) {
    return await User.findByPk(id);
  }

  async findUserByEmail(email: string) {
    return await User.findOne({
      where: {
        email,
      },
    });
  }
  async addUser(request: AddUserDto) {
    const existingUser = await this.findUserByEmail(request.email);
    if (existingUser) throw new ConflictException('User exists with the email');
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

  async login(request: LoginDto) {
    const existingUser = await this.findUserByEmail(request.email);
    if (!existingUser) throw new NotFoundException('Wrong email!');
    const isMatch = await bcrypt.compare(
      request.password,
      existingUser.password,
    );
    if (!isMatch) throw new BadRequestException('Invalid login credential');

    const payload = { userId: existingUser.id };
    return await this.jwtService.signAsync(payload, {
      secret: process.env['JWT_SECRET'],
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
