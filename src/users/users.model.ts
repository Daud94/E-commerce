import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { UsersStatus } from './enums/users-status.enum';
import { Product } from '../products/product.model';

@Table
export class User extends Model<User> {
  @Column({ type: DataType.STRING })
  firstName: string;

  @Column({ type: DataType.STRING })
  lastName: string;

  @Column({ type: DataType.STRING })
  email: string;

  @Column({ type: DataType.STRING })
  password: string;

  @Column({ type: DataType.ENUM(...Object.values(UsersStatus)) })
  status: string;

  @HasMany(() => Product, {
    foreignKey: 'userId',
    sourceKey: 'id',
    onDelete: 'CASCADE',
  })
  products: Product[];
}
