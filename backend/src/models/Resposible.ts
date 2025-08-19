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

import { Organism, Quadrant, CommunalCircuit } from ".";

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

    //TODO: Faltan las relaciones con la tabla consejo comunal ya que no fue creada aun
    
    @ForeignKey(()=> Organism)
    @Column
    organismId?: number

    @ForeignKey(()=> Quadrant)
    @Column
    quadrantId?: number

    @ForeignKey(()=> CommunalCircuit)
    @Column
    communalCircuitId?: number

    @CreatedAt
    createdAt!: Date

    @UpdatedAt
    updatedAt!: Date

    @DeletedAt
    deletedAt?: Date

    @BelongsTo(()=> Organism)
    organism?: Organism

    @BelongsTo(()=> Quadrant)
    quadrant?: Quadrant

    @BelongsTo(()=> CommunalCircuit)
    communalCircuit?: CommunalCircuit
}