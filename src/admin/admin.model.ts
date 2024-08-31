import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { Role } from './role.enum';

@Table
export class Admin extends Model<Admin> {
  @Column({ type: DataType.STRING })
  firstName: string;

  @Column({ type: DataType.STRING })
  lastName: string;

  @Column({ type: DataType.STRING })
  email: string;

  @Column({ type: DataType.STRING })
  password: string;

  @Column({ type: DataType.ENUM(...Object.values(Role)) })
  role: Role[];
}
