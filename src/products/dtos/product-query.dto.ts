import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus } from '../enums/product-status.enum';

export class ProductQueryDto {
  @IsOptional()
  searchTerm: string;

  @IsOptional()
  @IsEnum(ProductStatus)
  status: string;

  @IsOptional()
  minPrice?: number;

  @IsOptional()
  maxPrice?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  @IsOptional()
  readonly limit?: number = 20;

  get offset(): number {
    return (this.page - 1) * this.limit;
  }
}
