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

import { Quadrant, Responsible } from ".";

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

    @HasMany(()=> Responsible)
    Responsibles: Responsible[]

    @HasMany(()=> Quadrant)
    quadrant: Quadrant[]
}