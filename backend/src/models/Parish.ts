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

 import { Municipality } from ".";

 @Table({ tableName: 'Parish' })
 export default class Parish extends Model {
   @PrimaryKey
   @AutoIncrement
   @Column(DataType.INTEGER)
   id!: number

   @AllowNull(false)
   @Unique
   @Column
   name!: string

   @ForeignKey(() => Municipality)
   @Column(DataType.INTEGER)
   municipalityId!: number

   @CreatedAt
   createdAt!: Date

   @UpdatedAt
   updatedAt!: Date

   @DeletedAt
   deletionDate?: Date

   @BelongsTo(() => Municipality)
   municipality!: Municipality
 }