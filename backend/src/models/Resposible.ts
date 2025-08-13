import {
    AllowNull,
    AutoIncrement,
    CreatedAt, 
    UpdatedAt,
    DeletedAt, 
    PrimaryKey, 
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

    @AllowNull(true)
    @Column
    phoneBackup?: string

    @AllowNull(true)
    @Column
    email?: string

    @AllowNull(false)
    @Column
    position!: string

    @ForeignKey(()=> Organism)
    @Column
    organismId?: number

    //TODO: Faltan las relaciones con las tablas cuadrantes, circuito comunitario, comuna y consejo comunal ya que no fueron creados aun

    @CreatedAt
    createdAt!: Date

    @UpdatedAt
    updatedAt!: Date

    @DeletedAt
    deletedAt?: Date

    @BelongsTo(()=> Organism)
    organism?: Organism
}