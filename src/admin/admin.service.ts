import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from './admin.model';
import { LoginDto } from '../common/dtos/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
import { UserQueryDto } from '../users/dtos/user-query.dto';
import { UsersStatus } from '../users/enums/users-status.enum';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin) private readonly adminModel: typeof Admin,
    private readonly jwtService: JwtService,
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
  ) {}

  async getAdminById(id: number) {
    return await this.adminModel.findByPk(id);
  }

  private async findUserByEmail(email: string) {
    return await this.adminModel.findOne({
      where: {
        email,
      },
    });
  }

  async login(request: LoginDto) {
    const existingAdmin = await this.findUserByEmail(request.email);
    if (!existingAdmin) throw new NotFoundException('Wrong email!');
    const isMatch = await bcrypt.compare(
      request.password,
      existingAdmin.password,
    );
    if (!isMatch) throw new BadRequestException('Invalid login credential');

    const payload = { userId: existingAdmin.id, roles: existingAdmin.roles };
    return await this.jwtService.signAsync(payload, {
      secret: process.env['JWT_SECRET'],
    });
  }
}
