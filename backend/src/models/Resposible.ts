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
    BelongsTo,
    ForeignKey
} from "sequelize-typescript";

import { Organism } from ".";

@Table({tableName: 'Resposible'})
export default class Resposible extends Model{
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number

    @AllowNull(false)
    @Column
    firstName!: string

    @AllowNull(false)
    @Column
    lastName!: string

    @AllowNull(false)
    @Column
    ci!: string

    @AllowNull(false)
    @Column
    phone!: string

    @AllowNull(false)
    @Column
    phoneBackup?: string

    @AllowNull(false)
    @Column
    email?: string

    @AllowNull(false)
    @Column
    position!: string

    @ForeignKey(()=> Organism)
    @Column
    organismId?: string

    /* TODO: aqui estan los campos de ID para las tablas que aun no estan hechas

    @ForeignKey(()=> Quadrant)
    @Column
    quadrantId?: string
    
    @ForeignKey(()=> Circuit)
    @Column
    circuitId?: string
    
    @ForeignKey(()=> Commune)
    @Column
    communeId?: string
    
    @ForeignKey(()=> Council)
    @Column
    councilId?: string

    */

    @CreatedAt
    createdAt!: Date

    @UpdatedAt
    updatedAt!: Date

    @DeletedAt
    deletedAt?: Date

    @BelongsTo(()=> Organism)
    organism?: Organism
}