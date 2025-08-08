import {
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  DeletedAt,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'

import { Role } from '.'
import { RolePermission } from './join'

const RELATIONS = {
  ROLES: 'roles',
} as const satisfies Record<string, keyof Permission>

@Table ({ tableName: 'Permission' })
export default class Permission extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  })
  name!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  description!: string

  @DeletedAt
  deletionDate?: Date

  @BelongsToMany(() => Role, () => RolePermission)
  roles!: Array<Role & { RolePermission: RolePermission }>

 static readonly RELATIONS = RELATIONS
}
