import { Injectable } from '@nestjs/common';
import { ProductsService } from '../../products/products.service';
import { ProductQueryDto } from '../../products/dtos/product-query.dto';
import { ProductStatus } from '../../products/enums/product-status.enum';

@Injectable()
export class ProductsManagementService {
  constructor(private readonly productsService: ProductsService) {}

  async viewAllProducts(query: ProductQueryDto) {
    return await this.productsService.getAllProducts(query);
  }

  async viewProduct(productId: number) {
    return await this.productsService.findProductById(productId);
  }

  async suspendProduct(productId: number) {
    return await this.productsService.changeProductStatus(
      productId,
      ProductStatus.BANNED,
    );
  }

  async unsuspendProduct(productId: number) {
    return await this.productsService.changeProductStatus(
      productId,
      ProductStatus.APPROVED,
    );
  }

  async deleteProduct(productId: number) {
    await this.productsService.deleteProduct(productId);
  }
}
