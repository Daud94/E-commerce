import { PartialType } from '@nestjs/swagger';
import { AddProductDto } from './add-product.dto';

export class UpdateProductDto extends PartialType(AddProductDto) {}
