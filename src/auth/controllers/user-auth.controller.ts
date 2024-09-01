import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { AddUserDto } from '../../users/dtos/add-user.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from '../../common/dtos/login.dto';

@ApiTags('Users Authentication')
@Controller({ path: 'auth', version: '1' })
export class UserAuthController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'User registration' })
  @ApiCreatedResponse({
    description: 'Registration successful',
    example: {
      success: true,
      message: 'Registration successful',
    },
  })
  @Post('users/register')
  async register(@Body() request: AddUserDto) {
    try {
      await this.usersService.addUser(request);
      return {
        success: true,
        message: 'Registration successful',
      };
    } catch (e) {
      throw new HttpException(e.response.message, e.status);
    }
  }

  @ApiOperation({ summary: 'User login' })
  @ApiOkResponse({
    description: 'Login successful',
    example: {
      success: true,
      message: 'Login successful',
      accessToken: 'jwt_token',
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post('users/login')
  async login(@Body() request: LoginDto) {
    try {
      const token = await this.usersService.login(request);
      return {
        success: true,
        message: 'Login successful',
        accessToken: token,
      };
    } catch (e) {
      throw new HttpException(e.response.message, e.status);
    }
  }
}
