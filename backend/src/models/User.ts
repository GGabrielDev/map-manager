import bcrypt from 'bcrypt'
import {
  AllowNull,
  AutoIncrement,
  BeforeCreate,
  BeforeUpdate,
  BelongsToMany,
  Column,
  CreatedAt,
  DefaultScope,
  DeletedAt,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript'

import { Role } from '.'
import { UserRole } from './join'

const RELATIONS = {
  ROLES: 'roles',
} as const satisfies Record<string, keyof User>

@DefaultScope(() => ({
  attributes: { exclude: ['passwordHash'] },
}))
@Table({tableName: 'User'})
export default class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number

  @AllowNull(false)
  @Unique
  @Column
  username!: string

  @AllowNull(false)
  @Column
  passwordHash!: string

  @BelongsToMany(() => Role, () => UserRole)
  roles!: Array<Role & { UserRole: UserRole }>

  @CreatedAt
  creationDate!: Date

  @UpdatedAt
  updatedOn!: Date

  @DeletedAt
  deletionDate?: Date

  static readonly RELATIONS = RELATIONS
  static SALT_ROUNDS = 10

  // Password Verification
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash)
  }

  // Password Hashing
  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(instance: User) {
    if (instance.changed('passwordHash')) {
      instance.passwordHash = await bcrypt.hash(
        instance.passwordHash,
        User.SALT_ROUNDS
      )
    }
  }
}