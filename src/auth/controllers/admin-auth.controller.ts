import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AdminService } from '../../admin/admin.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../../common/dtos/login.dto';

@ApiTags('Admin Authentication')
@Controller({ path: 'auth', version: '1' })
export class AdminAuthController {
  constructor(private readonly adminService: AdminService) {}

  @HttpCode(HttpStatus.OK)
  @Post('admins/login')
  async login(@Body() request: LoginDto) {
    try {
      await this.adminService.login(request);
      return {
        success: true,
        message: 'Login successful',
      };
    } catch (e) {
      console.error(e);
      throw new HttpException(e.response, e.status);
    }
  }
}
