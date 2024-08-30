import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class AddProductDto {
  @IsNotEmpty({ message: 'Product name is required' })
  @Transform((params) => params.value.trim())
  name: string;

  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber()
  @IsPositive()
  @Min(1)
  price: number;

  @IsNotEmpty({ message: 'Description is required' })
  @Transform((params) => params.value.trim())
  description: string;

  @IsNotEmpty({ message: 'Quantity is required' })
  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;
}
