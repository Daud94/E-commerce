import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.model';
import { InjectModel } from '@nestjs/sequelize';
import { AddProductDto } from './dtos/add-product.dto';
import { ProductStatus } from './enums/product-status.enum';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Op } from 'sequelize';
import { PageMetaDto } from '../common/dtos/page-meta.dto';
import { ProductQueryDto } from './dtos/product-query.dto';
import { User } from '../users/users.model';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product) private readonly productModel: typeof Product,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findProductById(id: number, userId?: number) {
    return await this.productModel.findOne({
      where: {
        id,
        ...(userId && { userId: userId }),
      },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });
  }

  async addProduct(userId: number, request: AddProductDto) {
    await this.productModel.create({
      ...request,
      userId,
      status: ProductStatus.PENDING,
    });
  }

  async updateProduct(id: number, request: UpdateProductDto, userId?: number) {
    const existingProduct = await this.findProductById(id, userId);
    if (!existingProduct) throw new NotFoundException('Product not found');
    await existingProduct.update({ ...request });
  }

  async changeProductStatus(id: number, status: ProductStatus) {
    const existingProduct = await this.findProductById(id);
    if (!existingProduct) throw new NotFoundException('Product not found');
    await existingProduct.update({ status: status });
  }

  async getAllProducts(query: ProductQueryDto, userId?: number) {
    let key: string;
    if (query.status === 'Approved') {
      key = 'APPROVED_PRODUCTS';
    } else {
      key = 'ALL_PRODUCTS';
    }
    const value: any = await this.cacheManager.get(key);
    if (value) {
      return value;
    }
    const { rows, count } = await this.productModel.findAndCountAll({
      where: {
        ...(userId && { userId: userId }),
        ...(query.searchTerm && {
          [Op.or]: [
            {
              name: {
                [Op.iLike]: `%${query.searchTerm}`,
              },
            },
            {
              description: {
                [Op.iLike]: `%${query.searchTerm}`,
              },
            },
          ],
        }),
        ...(query.minPrice &&
          query.maxPrice && {
            price: {
              [Op.between]: [query.minPrice, query.maxPrice],
            },
          }),
        ...(query.status && { status: query.status }),
      },
      offset: query.offset,
      limit: query.limit,
      order: [['id', 'DESC']],
    });
    const metadata = new PageMetaDto({
      pageOptionsDto: query,
      itemCount: count,
    });
    if (rows.length !== 0) {
      await this.cacheManager.set(
        key,
        { rows, metadata },
        +process.env['CACHE_TTL'],
      );
    }
    return {
      rows,
      metadata,
    };
  }

  async deleteProduct(id: number, userId?: number) {
    const existingProduct = await this.findProductById(id, userId);
    if (!existingProduct) throw new NotFoundException('Product not found');
    await existingProduct.destroy();
  }
}
