import { Quadrant, Parish, Organism } from "@/models";
import { Op, OrderItem, Sequelize } from "sequelize";

interface PaginationOpstions{
    page: number
    pageSize: number
}

export const SortByOptions = ['name', 'creationDate', 'updatedOn']
export const SortOrderOptions = ['ASC', 'DESC']

export interface QuadrantFilterOptions extends PaginationOpstions {
    name?: string
    organismName?: string
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

//All Quadrant
export const allQuadrant = async({
    page,
    pageSize,
    name,
    organismName,
    parishName,
    sortBy,
    sortOrder= 'ASC'
}:QuadrantFilterOptions):Promise<PaginatedResult<Quadrant>> =>{
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

        const includeOptionsOrganism: any ={
            model: Organism,
            as: 'organism',
            required: false
        }
        if (organismName) {
            includeOptionsOrganism.where ={
                name: {[Op.iLike]: `%${organismName}%`}
            }
            includeOptionsOrganism.required = true
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
            :sortBy === 'updatedOn'
                ? 'updatedOn'
                : 'name'
            order = [[column, sortOrder]]
        }

        const data = await Quadrant.findAll({
            where,
            offset,
            limit: pageSize,
            order,
            include: [
                includeOptionsOrganism,
                includeOptionsParish
            ],
            attributes: {
                include: [[
                    Sequelize.literal(`ST_AsGeoJSON("boundary")::json`),
                    'boundary'
                ]]
            }
        })

        const total = await Quadrant.count({where})

        return {
            data,
            total,
            totalPage: Math.ceil(total / pageSize,),
            currentPage: page
        }
    } catch (error) {
        console.log(error)
        throw new Error("Error al obtener los cuadrantes, intente nuevamente.");
    }
}

//All QuadrantGeoJson
export const allQuadrantsGeoJSON = async ({
  name,
  organismName,
  parishName,
  sortBy,
  sortOrder = 'ASC'
}: Partial<QuadrantFilterOptions>) => {
  try {
    const andConditions: any[] = [];

    if (name) {
      andConditions.push({ name: { [Op.iLike]: `%${name}%` } });
    }

    const includeOptionsOrganism: any = {
      model: Organism,
      as: 'organism',
      required: false,
    };
    if (organismName) {
      includeOptionsOrganism.where = { name: { [Op.iLike]: `%${organismName}%` } };
      includeOptionsOrganism.required = true;
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

    const data = await Quadrant.findAll({
      where,
      order,
      include: [includeOptionsOrganism, includeOptionsParish],
      attributes: {
        include: [[Sequelize.literal(`ST_AsGeoJSON("boundary")::json`), 'boundary']]
      }
    });

    const features = data.map(quadrant => ({
      type: "Feature",
      geometry: quadrant.get('boundary'),
      properties: {
        id: quadrant.id,
        name: quadrant.name,
        parishId: quadrant.parishId,
        organismId: quadrant.organismId,
        metadata: quadrant.metadata,
        fleet: quadrant.fleet,
        createdAt: quadrant.createdAt,
        updatedAt: quadrant.updatedAt,
        deletionDate: quadrant.deletionDate,
        organism: quadrant.organism,
        parish: quadrant.parish
      }
    }));

    return {
      type: "FeatureCollection",
      features
    };

  } catch (error) {
    throw new Error("Error al obtener los cuadrantes en formato GeoJSON.");
  }
}

// get Quedrant by ID
export const getById = async (id: number):Promise<Quadrant | null> =>{
    try {
        const quadrant = await Quadrant.findOne({
            where: {id}
        })

        if (!quadrant) {
            throw new Error("Cuandrante no encontrado");
        }

        return quadrant;
    } catch (error) {
        throw new Error("Error al obtener cuadrante, intente nuevamente.")
    }    
}

// get Quedrant GeoJson by ID
export const getByIdGeoJson = async (id: number)=>{
    try {
        const quadrant = await Quadrant.findOne({
            where: {id},
             include: [
                { model: Organism, as: 'organism', required: false },
                { model: Parish, as: 'parish', required: false }
            ],
            attributes: {
                include: [
                    [Sequelize.literal(`ST_AsGeoJSON("boundary")::json`), 'boundary']
                ]
            }
        })

        if (!quadrant) {
            throw new Error("Cuandrante no encontrado");
        }

        return {
            type: "Feature",
            geometry: quadrant.get('boundary'),  // GeoJSON puro
            properties: {
                id: quadrant.id,
                name: quadrant.name,
                parishId: quadrant.parishId,
                organismId: quadrant.organismId,
                metadata: quadrant.metadata,
                fleet: quadrant.fleet,
                createdAt: quadrant.createdAt,
                updatedAt: quadrant.updatedAt,
                deletionDate: quadrant.deletionDate,
                organism: quadrant.organism,
                parish: quadrant.parish,
            }
        };
    } catch (error) {
        throw new Error("Error al obtener cuadrante, intente nuevamente.")
    }    
}

//create quadrant
export const createQuadrant = async (
    name: string,
    boundary: object,
    parishId?: number,
    organismId?: number,
    fleet?: {
        small: {active: number; inactive: number};
        big: {active: number; inactive: number};
        bike: {active: number; inactive: number};
    },
    metadata?: object
): Promise<Quadrant> =>{
    try {
        const existQudarant = await Quadrant.findOne({where: {name, parishId, organismId,}})

        if (existQudarant) {
            throw new Error("El cuadrante ya existe.")
        }

        const createQuadrant = await Quadrant.create({
            name,
            boundary,
            parishId,
            organismId,
            fleet,
            metadata
        })

        return createQuadrant;
    } catch (error) {
        throw new Error("Error al crear el cuadrante, intente nuevamente.")
    }
}

//update quadrant
export const updateQuadrant = async(updates: Partial<Quadrant>): Promise<Quadrant | null> =>{
    try {
        const existParish = await Parish.findOne({where: {id: updates.parishId}})
        if (!existParish) {
            throw new Error("El ID de la parroquia no existe.")
        }
        const existOrganism = await Organism.findOne({where: {id: updates.organismId}})
        if (!existOrganism) {
            throw new Error("El ID del organismo no existe.")
        }
        const updateToQuadrant = await Quadrant.findOne({where:{id: updates.id}})
        if (!updateToQuadrant) {
            throw new Error("Cuadrante no encontrado");
        }

        await updateToQuadrant.update(updates)

        return updateToQuadrant;
    } catch (error) {
        throw new Error("Error al actualizar el cuadrante.")
    }
}

//delete quadrant
export const deleteQuadrant = async (id:number): Promise<boolean> =>{
    try {
        const quadrant = await Quadrant.findOne({where: {id}})

        if (!quadrant) {
            return false;
        }

        await quadrant.destroy()
        return true;
    } catch (error) {
        throw new Error("Error al eliminar el cuadrante")
    }
}