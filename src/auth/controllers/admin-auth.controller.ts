import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Version,
} from '@nestjs/common';
import { AdminService } from '../../admin/admin.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../../common/dtos/login.dto';

@ApiTags('Admin Authentication')
@Controller({ path: 'auth', version: '1' })
export class AdminAuthController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Admin login' })
  @ApiOkResponse({
    description: 'Login successful',
    example: {
      success: true,
      message: 'Login successful',
      accessToken: 'jwt_token',
    },
  })
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Post('admins/login')
  async login(@Body() request: LoginDto) {
    try {
      const data = await this.adminService.login(request);
      return {
        success: true,
        message: 'Login successful',
        accessToken: data,
      };
    } catch (e) {
      console.error(e);
      throw new HttpException(e.response, e.status);
    }
  }
}
