import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { Role } from '../auth/roles/role.enum';

@Table
export class Admin extends Model<Admin> {
  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.STRING })
  email: string;

  @Column({ type: DataType.STRING })
  password: string;

  @Column({ type: DataType.ENUM(...Object.values(Role)) })
  roles: Role[];
}
