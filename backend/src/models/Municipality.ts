import { 
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    CreatedAt,
    DataType,
    DeletedAt,
    ForeignKey,
    HasMany,
    Model,
    PrimaryKey,
    Table,
    Unique,
    UpdatedAt
 } from "sequelize-typescript";

 import { State, Parish } from ".";

 @Table ({tableName: 'Municipality'})
 export default class Municipality extends Model {
   @PrimaryKey
   @AutoIncrement
   @Column(DataType.INTEGER)
   id!: number

   @AllowNull(false)
   @Unique
   @Column
   name!: string
   
   @ForeignKey(() => State)
   @Column(DataType.INTEGER)
   stateId!: number
   
   @CreatedAt
   createdAt!: Date
   
   @UpdatedAt
   updatedAt!: Date
   
   @DeletedAt
   deletionDate?: Date

   @BelongsTo(() => State)
   state!: State

   @HasMany(() => Parish)
   parishes!: Parish[]
 }