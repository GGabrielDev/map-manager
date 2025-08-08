import {
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript'

import { Permission, User } from '.'
import { RolePermission, UserRole } from './join'

const RELATIONS = {
  PERMISSIONS: 'permissions',
  USERS: 'users',
} as const satisfies Record<string, keyof Role>

@Table ({ tableName: 'Role' })
export default class Role extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number

  @AllowNull(false)
  @Unique
  @Column
  name!: string

  @AllowNull(true)
  @Column
  description?: string

  @CreatedAt
  creationDate!: Date

  @UpdatedAt
  updatedOn!: Date

  @DeletedAt
  deletionDate?: Date

  @BelongsToMany(() => User, () => UserRole)
  users!: Array<User & { UserRole: UserRole }>

  @BelongsToMany(() => Permission, () => RolePermission)
  permissions!: Array<Permission & { RolePermission: RolePermission }>

  static readonly RELATIONS = RELATIONS
}
