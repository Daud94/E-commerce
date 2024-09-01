import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AddProductDto } from './dtos/add-product.dto';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductStatus } from './enums/product-status.enum';
import { ProductQueryDto } from './dtos/product-query.dto';

@ApiTags('Products')
@Controller({ path: 'products', version: '1' })
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @ApiBearerAuth('user-auth')
  @ApiOperation({ summary: 'User adds/lists a product' })
  @ApiOkResponse({
    description: 'Product added',
    example: {
      success: true,
      message: 'Product added',
    },
  })
  @UseGuards(UserAuthGuard)
  @Post()
  async addProduct(@Body() request: AddProductDto, @Request() req) {
    try {
      await this.productService.addProduct(req.userId, request);
      return {
        success: true,
        message: 'Product added',
      };
    } catch (e) {
      console.error(e);
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiBearerAuth('user-auth')
  @ApiOperation({ summary: 'User fetches all his/her listed products' })
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
  @UseGuards(UserAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllProducts(@Query() query: ProductQueryDto, @Request() req) {
    try {
      const data = await this.productService.getAllProducts(query, req.userId);
      return {
        success: true,
        message: 'Products fetched',
        data: data.rows,
        metadata: data.metadata,
      };
    } catch (e) {
      console.error(e);
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiOperation({
    summary: 'User fetches all approved products',
    description:
      'Unauthenticated users would see only approved products via this route',
  })
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
          status: 'Approved',
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
  @Get('approved')
  async getAllApprovedProducts(@Query() query: ProductQueryDto) {
    try {
      const data = await this.productService.getAllProducts({
        ...query,
        status: ProductStatus.APPROVED,
        offset: query.offset,
      });
      return {
        success: true,
        message: 'Products fetched',
        data: data.rows,
        metadata: data.metadata,
      };
    } catch (e) {
      console.error(e);
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiBearerAuth('user-auth')
  @ApiOperation({ summary: 'User fetches details of a product' })
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
  @UseGuards(UserAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async viewProduct(@Param('id', ParseIntPipe) id: number, @Request() req) {
    try {
      const product = await this.productService.findProductById(id, req.userId);
      return {
        success: true,
        message: 'Product details fetched',
        data: product,
      };
    } catch (e) {
      console.error(e);
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiBearerAuth('user-auth')
  @ApiOperation({
    summary: 'User updates a product',
    description:
      'The route allows a user to update the value of any one of his listed products',
  })
  @ApiOkResponse({ description: 'Product updated' })
  @UseGuards(UserAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdateProductDto,
    @Request() req,
  ) {
    try {
      await this.productService.updateProduct(id, request, req.userId);
      return {
        success: true,
        message: 'Product updated',
      };
    } catch (e) {
      console.error(e);
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiBearerAuth('user-auth')
  @ApiOperation({
    summary: 'User deletes a product',
    description:
      'The route allows a user to delete anyone of his listed products',
  })
  @ApiOkResponse({ description: 'Product deleted' })
  @UseGuards(UserAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number, @Request() req) {
    try {
      await this.productService.deleteProduct(id, req.userId);
      return {
        success: true,
        message: 'Product deleted',
      };
    } catch (e) {
      console.error(e);
      throw new HttpException(e.response, e.status);
    }
  }
}
