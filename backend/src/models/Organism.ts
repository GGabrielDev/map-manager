import {
    AllowNull,
    AutoIncrement,
    CreatedAt, 
    UpdatedAt,
    DeletedAt, 
    PrimaryKey, 
    Unique,
    Column,
    Table,
    Model,
    DataType,
    HasMany
} from "sequelize-typescript";

import { 
    Responsible,
    //PointOfInterest
 } from ".";

@Table({tableName: 'Organism'})
export default class Organism extends Model{
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
    deletedAt?: Date

    /*TODO aqui esta la relacion de 1 a muchos de organismos con puntos de interes, pero como he hecho la tabla aun esta comentada para evitar los errores

    @HasMany(()=> PointOfInterest)
    PointsOfInterest: PointOfInterest[]

    */

    @HasMany(()=> Responsible)
    Responsibles: Responsible[]
}