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
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AddProductDto } from './dtos/add-product.dto';
import { UserAuthGuard } from '../auth/controllers/user-auth.guard';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductStatus } from './enums/product-status.enum';

@ApiTags('Products')
@Controller({ path: 'products', version: '1' })
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

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

  @UseGuards(UserAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllProducts(@Query() query: PageOptionsDto, @Request() req) {
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

  @HttpCode(HttpStatus.OK)
  @Get('approved')
  async getAllApprovedProducts(@Query() query: PageOptionsDto) {
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

  @UseGuards(UserAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async viewProduct(@Param('id', ParseIntPipe) id: number, @Request() req) {
    try {
      const product = await this.productService.findProductById(id, req.userId);
      return {
        success: true,
        message: 'Product fetched',
        data: product,
      };
    } catch (e) {
      console.error(e);
      throw new HttpException(e.response, e.status);
    }
  }

  @UseGuards(UserAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Put(':id')
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
