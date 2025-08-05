import {
  AfterBulkCreate,
  AfterBulkDestroy,
  BeforeBulkDestroy,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'

import { Role, User } from '@/models'

@Table({ tableName: 'UserRole', timestamps: false })
export default class UserRole extends Model {
  @ForeignKey(() => User)
  @Column
  userId!: number

  @ForeignKey(() => Role)
  @Column
  roleId!: number

  // Add hooks for link/unlink
  @BeforeBulkDestroy
  static async cacheDestroyedInstances(options: any) {
    // Find affected instances and attach to options
    options.instancesToLog = await UserRole.findAll({ where: options.where })
  }
}