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
    ForeignKey,
    HasMany,
    Validate
} from "sequelize-typescript";

import { Organism, Quadrant, CommunalCircuit, PointOfInterest } from ".";

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
    @Validate({
        isValidCI(value: string) {
            const ciRegex = /^[A-Z]\d+$/;
            if (!ciRegex.test(value)) {
            throw new Error("ci debe comenzar con letra mayúscula seguida de números");
            }
        }
    })
    @Column
    ci!: string

    @AllowNull(false)
    @Validate({
        isValidPhone(value: string) {
            const fixedPhone = /^0\d{2}-\d{7}$/;
            const mobilePhone = /^04(12|14|16|22|24|26)-\d{7}$/;
            if (!fixedPhone.test(value) && !mobilePhone.test(value)) {
                throw new Error("phone debe ser un número fijo o móvil venezolano válido");
            }
        },
  })
    @Column
    phone!: string

    @AllowNull(true)
    @Validate({
        isValidPhone(value: string) {
            const fixedPhone = /^0\d{2}-\d{7}$/;
            const mobilePhone = /^04(12|14|16|22|24|26)-\d{7}$/;
            if (!fixedPhone.test(value) && !mobilePhone.test(value)) {
                throw new Error("phone debe ser un número fijo o móvil venezolano válido");
            }
        },
    })
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
    updatedOn!: Date

    @DeletedAt
    deletedAt?: Date

    @HasMany(()=> PointOfInterest)
    pointsOfInterest: PointOfInterest[]

    @BelongsTo(()=> Organism)
    organism?: Organism

    @BelongsTo(()=> Quadrant)
    quadrant?: Quadrant

    @BelongsTo(()=> CommunalCircuit)
    communalCircuit?: CommunalCircuit
}