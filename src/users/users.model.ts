import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { UsersStatus } from './enums/users-status.enum';

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
}
