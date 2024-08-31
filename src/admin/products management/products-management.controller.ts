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
import { AdminAuthGuard } from '../../auth/guards/admin-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { ProductsManagementService } from './products-management.service';
import { ProductQueryDto } from '../../products/dtos/product-query.dto';
import { Role } from '../../auth/roles/role.enum';
import { Roles } from '../../auth/roles/roles.decorator';

@ApiTags('Admin[Products Management]')
@Controller({ path: 'admin/products-management', version: '1' })
export class ProductsManagementController {
  constructor(
    private readonly productsManagementService: ProductsManagementService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @UseGuards(AdminAuthGuard)
  @Get('products')
  async viewAllProducts(@Query() query: ProductQueryDto) {
    try {
      const data = await this.productsManagementService.viewAllProducts(query);
      return {
        success: true,
        message: 'Products fetched',
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
  @Get('products/:id')
  async viewProduct(@Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.productsManagementService.viewProduct(id);
      return {
        success: true,
        message: 'Product details fetched',
        data: data,
      };
    } catch (e) {
      throw new HttpException(e.response.message, e.status);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @UseGuards(AdminAuthGuard)
  @Patch('products/:id/suspend')
  async suspendProduct(@Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.productsManagementService.suspendProduct(id);
      return {
        success: true,
        message: 'Product suspended',
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
  async unsuspendProduct(@Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.productsManagementService.unsuspendProduct(id);
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
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.productsManagementService.deleteProduct(id);
      return {
        success: true,
        message: 'Product removed',
      };
    } catch (e) {
      throw new HttpException(e.response.message, e.status);
    }
  }
}
