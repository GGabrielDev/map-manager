import {
  AfterBulkCreate,
  AfterBulkDestroy,
  BeforeBulkDestroy,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'

import { Permission, Role } from '@/models'

@Table({ tableName: 'RolePermission', timestamps: false })
export default class RolePermission extends Model {
  @ForeignKey(() => Role)
  @Column
  roleId!: number

  @ForeignKey(() => Permission)
  @Column
  permissionId!: number

  @BeforeBulkDestroy
  static async cacheDestroyedInstances(options: any) {
    options.instancesToLog = await RolePermission.findAll({
      where: options.where,
    })
  }

}