import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { UsersStatus } from '../enums/users-status.enum';
import { Type } from 'class-transformer';

export class UserQueryDto {
  @IsOptional()
  searchTerm?: string;

  @IsOptional()
  @IsEnum(UsersStatus)
  status?: string;

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
