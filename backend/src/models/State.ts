import { 
    AllowNull,
    AutoIncrement,
    Column,
    CreatedAt,
    DataType,
    DeletedAt,
    HasMany,
    Model,
    PrimaryKey,
    Table,
    Unique,
    UpdatedAt
 } from "sequelize-typescript";

 import { Municipality } from ".";

 @Table({tableName: 'State'})
 export default class State extends Model {
   @PrimaryKey
   @AutoIncrement
   @Column(DataType.INTEGER)
   id!: number

   @AllowNull(false)
   @Unique
   @Column
   name!: string

   @CreatedAt
   createdAt!: Date

   @UpdatedAt
   updatedAt!: Date

   @DeletedAt
   deletionDate?: Date

   @HasMany(() => Municipality)
   Municipalities: Municipality[]
 }