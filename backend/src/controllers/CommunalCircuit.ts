import { CommunalCircuit, Parish } from "@/models";
import { Op, OrderItem, Sequelize } from "sequelize";

interface PaginationOpstions{
    page: number
    pageSize: number
}

export const SortByOptions = ['name', 'creationDate', 'updateDate']
export const SortOrderOptions = ['ASC', 'DESC']

export interface CommunalCircuitFilterOptions extends PaginationOpstions {
    name?: string
    parishName?: string
    sortBy?: (typeof SortByOptions)[number]
    sortOrder?:(typeof SortOrderOptions)[number]
}

interface PaginatedResult<T> {
    data: T[]
    total: number
    totalPage: number
    currentPage: number
}

//All Communal circuit
export const allCommunalCircuits = async({
    page,
    pageSize,
    name,
    parishName,
    sortBy,
    sortOrder= 'ASC'
}:CommunalCircuitFilterOptions):Promise<PaginatedResult<CommunalCircuit>> =>{
    try {
        if (page <1 || pageSize <1) {
            return {data: [], total: 0, totalPage: 0, currentPage: page}
        }

        const offset = (page - 1) * pageSize
        const andConditions: any[]=[]

        // filter by name
        if (name) {
            andConditions.push({ name:{[Op.like]: `${name}$`} })
        }

        const includeOptionsParish: any ={
            model: Parish,
            as: 'parish',
            required: false
        }

        if (parishName) {
            includeOptionsParish.where ={
                name: {[Op.iLike]: `%${parishName}%`}
            }
            includeOptionsParish.required = true
        }

        const where = andConditions.length ? {[Op.and]: andConditions}:  undefined

        let order: OrderItem[] | undefined = undefined
        if (sortBy) {
            const column =
            sortBy === 'creationDate'
            ? 'creationDate'
            :sortBy === 'updateOn'
                ? 'updateOn'
                : 'name'
            order = [[column, sortOrder]]
        }

        const data = await CommunalCircuit.findAll({
            where,
            offset,
            limit: pageSize,
            order,
            include: [
                includeOptionsParish
            ],
            attributes: {
                include: [[
                    Sequelize.literal(`ST_AsGeoJSON("boundary")::json`),
                    'boundary'
                ]]
            }
        })

        const total = await Parish.count({where})

        return {
            data,
            total,
            totalPage: Math.ceil(total / pageSize,),
            currentPage: page
        }
    } catch (error) {
        throw new Error("Error al obtener los circuitos comunales, intente nuevamente.");
    }
}

//All QuadrantGeoJson
export const allCommunalCircuitsGeoJSON = async ({
  name,
  parishName,
  sortBy,
  sortOrder = 'ASC'
}: Partial<CommunalCircuitFilterOptions>) => {
  try {
    const andConditions: any[] = [];

    if (name) {
      andConditions.push({ name: { [Op.iLike]: `%${name}%` } });
    }

    const includeOptionsParish: any = {
      model: Parish,
      as: 'parish',
      required: false,
    };
    if (parishName) {
      includeOptionsParish.where = { name: { [Op.iLike]: `%${parishName}%` } };
      includeOptionsParish.required = true;
    }

    const where = andConditions.length ? { [Op.and]: andConditions } : undefined;

    let order: OrderItem[] | undefined = undefined;
    if (sortBy) {
      const column =
        sortBy === 'creationDate' ? 'creationDate' :
        sortBy === 'updateDate' ? 'updatedOn' :
        'name';
      order = [[column, sortOrder]];
    }

    const data = await CommunalCircuit.findAll({
      where,
      order,
      include: [includeOptionsParish],
      attributes: {
        include: [[Sequelize.literal(`ST_AsGeoJSON("boundary")::json`), 'boundary']]
      }
    });

    const features = data.map(communalCircuit => ({
      type: "Feature",
      geometry: communalCircuit.get('boundary'),
      properties: {
        id: communalCircuit.id,
        name: communalCircuit.name,
        parishId: communalCircuit.parishId,
        addres: communalCircuit.addres,
        code: communalCircuit.code,
        metadata: communalCircuit.metadata,
        createdAt: communalCircuit.createdAt,
        updatedAt: communalCircuit.updatedAt,
        deletionDate: communalCircuit.deletionDate,
        parish: communalCircuit.parish
      }
    }));

    return {
      type: "FeatureCollection",
      features
    };

  } catch (error) {
    throw new Error("Error al obtener los circuitos comunales en formato GeoJSON.");
  }
}

// get communal circuit by ID
export const getById = async (id: number):Promise<CommunalCircuit | null> =>{
    try {
        const communalCircuit = await CommunalCircuit.findOne({
            where: {id}
        })

        if (!communalCircuit) {
            throw new Error("Circuito comunales no encontrado");
        }

        return communalCircuit;
    } catch (error) {
        throw new Error("Error al obtener circuito comunales, intente nuevamente.")
    }    
}

// get communal circuit GeoJson by ID
export const getByIdGeoJson = async (id: number):Promise<CommunalCircuit | null> =>{
    try {
        const communalCircuit = await CommunalCircuit.findOne({
            where: {id},
            include: [
                { model: Parish, as: 'parish', required: false }
            ],
            attributes: {
                include: [
                    [Sequelize.literal(`ST_AsGeoJSON("boundary")::json`), 'boundary']
                ]
            }
        })

        if (!communalCircuit) {
            throw new Error("Circuito comunal no encontrado");
        }

        return communalCircuit;
    } catch (error) {
        throw new Error("Error al obtener circuito comunal, intente nuevamente.")
    }    
}

//create communal circuit
export const createQuadrant = async (
    name: string,
    parishId: number,
    addres: string,
    code: string,
    boundary: object,
    metadata?: object
): Promise<CommunalCircuit> =>{
    try {
        const existCommunalCircuit = await CommunalCircuit.findOne({where: {name, parishId,}})

        if (existCommunalCircuit) {
            throw new Error("El circuito comunal ya existe.")
        }

        const createCommunalCircuit = await CommunalCircuit.create({
            name,
            parishId,
            addres,
            code,
            boundary,
            metadata
        })

        return createCommunalCircuit;
    } catch (error) {
        throw new Error("Error al crear el circuito comunal, intente nuevamente.")
    }
}

//update comunalCircuit
export const updateComunalCircuit = async(updates: Partial<CommunalCircuit>): Promise<CommunalCircuit | null> =>{
    try {
        const existParish = await Parish.findOne({where: {id: updates.parishId}})
        if (!existParish) {
            throw new Error("El ID de la parroquia no existe.")
        }

        const updateToCommunalCircuit = await CommunalCircuit.findOne({where:{id: updates.id}})
        if (!updateToCommunalCircuit) {
            throw new Error("Cicuito comunal no encontrado");
        }

        await updateToCommunalCircuit.update(updates)

        return updateToCommunalCircuit;
    } catch (error) {
        throw new Error("Error al actualizar el circuito comunal.")
    }
}

//delete communal circuit
export const deleteCommunalCircuit = async (id:number): Promise<boolean> =>{
    try {
        const communalCircuit = await CommunalCircuit.findOne({where: {id}})

        if (!communalCircuit) {
            return false;
        }

        await communalCircuit.destroy()
        return true;
    } catch (error) {
        throw new Error("Error al eliminar el circuito comunal")
    }
}