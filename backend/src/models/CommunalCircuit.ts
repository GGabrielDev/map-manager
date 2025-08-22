import { 
    Table, 
    Model,
    PrimaryKey,
    AutoIncrement,
    Column,
    DataType,
    AllowNull,
    Unique,
    ForeignKey,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    BelongsTo,
    HasMany
} from "sequelize-typescript";

 import { Parish, Responsible, Quadrant } from ".";

 @Table({ 
    tableName: "CommunalCircuit",
    indexes: [{
        name: 'boundaryCommunalCircuitIndex',
        fields: ['boundary'],
        using: 'gist'
    }]
})
 export default class CommunalCircuit extends Model{
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
    parishId?: number

    @ForeignKey(() => Quadrant)
    @Column(DataType.INTEGER)
    quadrantId!: number

    @AllowNull(false)
    @Column
    addres?: string

    @AllowNull(false)
    @Column
    code?: string

    @AllowNull(false)
    @Column(DataType.GEOMETRY('POLYGON'))
    boundary!: object
    
    @AllowNull(true)
    @Column(DataType.JSON)
    metadata?: object;

    @AllowNull(false)
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    active!: boolean;

    @CreatedAt
    createdAt!: Date
    
    @UpdatedAt
    updatedOn!: Date
    
    @DeletedAt
    deletionDate?: Date

    @HasMany(()=>Responsible)
    responsible!: Responsible

    @BelongsTo(() => Quadrant)
    quadrant?: Quadrant

    @BelongsTo(() => Parish)
    parish?: Parish
 }