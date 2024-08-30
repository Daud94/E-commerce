import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ProductStatus } from './enums/product-status.enum';
import { User } from '../users/users.model';

@Table
export class Product extends Model<Product> {
  @Column({ type: DataType.STRING })
  name: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    get() {
      return parseFloat(this.getDataValue('price'));
    },
  })
  price: number;

  @Column({ type: DataType.STRING })
  description: string;

  @Column({ type: DataType.INTEGER })
  quantity: number;

  @Column({ type: DataType.ENUM(...Object.values(ProductStatus)) })
  status: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
