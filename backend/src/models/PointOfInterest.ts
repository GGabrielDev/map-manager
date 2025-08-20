import { 
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
  Validate
} from "sequelize-typescript";

import { CommunalCircuit, Quadrant, Organism, Responsible } from ".";  // Asegúrate de tener estas importaciones según tus modelos

@Table({tableName: 'point_of_interest'})
export default class PointOfInterest extends Model {
  
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  name!: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  description?: string;

  @AllowNull(false)
  @Validate({
    isValidPoint(value: any) {
      if (
        typeof value !== "object" ||
        value === null ||
        value.type !== "Point" ||
        !Array.isArray(value.coordinates) ||
        value.coordinates.length !== 2 ||
        !value.coordinates.every((coord: any) => typeof coord === "number")
      ) {
        throw new Error("El campo geometry debe ser una geometría POINT válida");
      }
    }
  })
  @Column(DataType.GEOMETRY("POINT"))
  geometry!: object;

  @ForeignKey(() => Responsible)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  responsibleId!: number;

  @ForeignKey(() => Organism)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  organismId!: number;

  @ForeignKey(() => CommunalCircuit)
  @AllowNull(true)
  @Column(DataType.INTEGER)
  communalCircuitId?: number;

  @ForeignKey(() => Quadrant)
  @AllowNull(true)
  @Column(DataType.INTEGER)
  quadrantId?: number;


  // Fechas automáticas
  @CreatedAt
  creationDate!: Date;

  @UpdatedAt
  updatedOn!: Date;

  @DeletedAt
  deletionDate?: Date;

  // Relaciones
  @BelongsTo(() => Responsible)
  responsible!: Responsible;

  @BelongsTo(() => Organism)
  organism!: Organism;

  @BelongsTo(() => CommunalCircuit)
  communalCircuit?: CommunalCircuit;

  @BelongsTo(() => Quadrant)
  quadrant?: Quadrant;

}
