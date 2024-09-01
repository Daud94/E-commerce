import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './product.model';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { JwtService } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [SequelizeModule.forFeature([Product]), CacheModule.register()],
  providers: [ProductsService, JwtService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
