import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './product.model';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([Product]), AuthModule],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsModule],
})
export class ProductsModule {}
