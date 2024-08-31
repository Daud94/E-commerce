import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.model';
import { InjectModel } from '@nestjs/sequelize';
import { AddProductDto } from './dtos/add-product.dto';
import { ProductStatus } from './enums/product-status.enum';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Op } from 'sequelize';
import { PageMetaDto } from '../common/dtos/page-meta.dto';
import { ProductQueryDto } from './dtos/product-query.dto';
import { User } from '../users/users.model';
import { UsersStatus } from '../users/enums/users-status.enum';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product) private readonly productModel: typeof Product,
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
