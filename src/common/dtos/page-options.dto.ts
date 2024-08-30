import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { UsersStatus } from '../../users/enums/users-status.enum';

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PageOptionsDto {
  @IsEnum(Order, { message: 'Option selected is invalid' })
  @IsOptional()
  readonly order?: Order = Order.DESC;

  @IsOptional()
  searchTerm?: string;

  @IsOptional()
  @IsEnum(UsersStatus)
  status: string;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : new Date('1970-01-01')))
  startDate?: Date;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
  endDate?: Date;

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
