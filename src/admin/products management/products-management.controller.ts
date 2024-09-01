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
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ProductsManagementService } from './products-management.service';
import { ProductQueryDto } from '../../products/dtos/product-query.dto';
import { Role } from '../../auth/roles/role.enum';
import { Roles } from '../../auth/roles/roles.decorator';

@ApiBearerAuth('admin-auth')
@ApiTags('Admin[Products Management]')
@Controller({ path: 'admin/products-management', version: '1' })
export class ProductsManagementController {
  constructor(
    private readonly productsManagementService: ProductsManagementService,
  ) {}

  @ApiOperation({ summary: 'Admin fetches all products' })
  @ApiOkResponse({
    description: 'Products fetched',
    example: {
      success: true,
      message: 'Products fetched',
      data: [
        {
          price: 10000000,
          id: 3,
          name: 'Electric Motor',
          description: 'White',
          quantity: 10,
          status: 'Pending',
          userId: 1,
          createdAt: '2024-08-31T03:44:21.166Z',
          updatedAt: '2024-08-31T03:44:21.166Z',
        },
      ],
      metadata: {
        page: 1,
        limit: 20,
        itemCount: 1,
        pageCount: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    },
  })
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

  @ApiOperation({ summary: 'Admin fetches details of a product' })
  @ApiOkResponse({
    description: 'Product details fetched',
    example: {
      success: true,
      message: 'Product details fetched',
      data: {
        price: 10000000,
        id: 3,
        name: 'Electric Motor',
        description: 'White',
        quantity: 10,
        status: 'Pending',
        userId: 1,
        createdAt: '2024-08-31T03:44:21.166Z',
        updatedAt: '2024-08-31T03:44:21.166Z',
      },
    },
  })
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

  @ApiOperation({ summary: 'Admin suspend/ban a product' })
  @ApiOkResponse({
    description: 'Product suspended',
    example: {
      success: true,
      message: 'Product suspended',
    },
  })
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @UseGuards(AdminAuthGuard)
  @Patch('products/:id/suspend')
  async suspendProduct(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.productsManagementService.suspendProduct(id);
      return {
        success: true,
        message: 'Product suspended',
      };
    } catch (e) {
      throw new HttpException(e.response.message, e.status);
    }
  }

  @ApiOperation({ summary: 'Admin removes product suspension' })
  @ApiOkResponse({
    description: 'Suspension removed',
    example: {
      success: true,
      message: 'Suspension removed',
    },
  })
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @UseGuards(AdminAuthGuard)
  @Patch('users/:id/unsuspend')
  async unsuspendProduct(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.productsManagementService.unsuspendProduct(id);
      return {
        success: true,
        message: 'Suspension removed',
      };
    } catch (e) {
      throw new HttpException(e.response.message, e.status);
    }
  }

  @ApiOperation({ summary: 'Admin delete a product' })
  @ApiOkResponse({
    description: 'Product removed',
    example: {
      success: true,
      message: 'Product removed',
    },
  })
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
