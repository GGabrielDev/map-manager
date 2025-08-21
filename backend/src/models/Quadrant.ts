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
    UpdatedAt,
    Validate
 } from "sequelize-typescript";

 import { Parish, Organism, Responsible, PointOfInterest } from ".";

 @Table({ 
  tableName: 'Quadrant',
  indexes: [{
    name: 'boundaryQuadrantIndex',
    fields: ['boundary'],
    using: 'gist'
  }]
  })
 export default class Quadrant extends Model {
   @PrimaryKey
   @AutoIncrement
   @Column(DataType.INTEGER)
   id!: number

   @AllowNull(false)
   @Unique
   @Column
   name!: string

   @ForeignKey(() => Parish)
   @Column(DataType.INTEGER)
   parishId!: number

   @ForeignKey(() => Organism)
   @Column(DataType.INTEGER)
   organismId!: number

   @Column(DataType.GEOMETRY('POLYGON'))
   boundary!: object

   @AllowNull(true)
   @Column(DataType.JSON)
   metadata?: object;

   @AllowNull(false)
   @Validate({
    fleetNegative(value: any){
      ['small', 'big', 'bike'].forEach(type => {
        ['active', 'inactive'].forEach(status => {
          const num = value?.[type]?.[status];
          if (!Number.isInteger(num) || num < 0) {
            throw new Error(`${type}.${status} debe ser un entero positivo`)
          }
        })
      });
    }
  })
  @Column(DataType.JSON)
   fleet!: {
     small: { active: number, inactive: number },
     big: { active: number, inactive: number },
     bike: { active: number, inactive: number }
   };

   @CreatedAt
   createdAt!: Date

   @UpdatedAt
   updatedAt!: Date

   @DeletedAt
   deletionDate?: Date

   @HasMany(()=> Responsible)
   responsible!: Responsible

   @HasMany(() => PointOfInterest)
   pointsOfInterest!: PointOfInterest[]

   @BelongsTo(() => Parish)
   parish!: Parish

   @BelongsTo(() => Organism)
   organism!: Organism
 }