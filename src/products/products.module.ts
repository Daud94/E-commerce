import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './product.model';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [SequelizeModule.forFeature([Product])],
  providers: [ProductsService, JwtService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
