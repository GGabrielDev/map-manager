import { CommunalCircuit, Parish } from "@/models";
import { Op, OrderItem, Sequelize } from "sequelize";

import { HttpError } from "@/utils/error-utils"

interface PaginationOptions{
    page: number
    pageSize: number
}

export const SortByOptions = ['name', 'creationDate', 'updatedOne']
export const SortOrderOptions = ['ASC', 'DESC']

export interface CommunalCircuitFilterOptions extends PaginationOptions {
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

        const total = await CommunalCircuit.count({where})

        return {
            data,
            total,
            totalPage: Math.ceil(total / pageSize),
            currentPage: page
        }
    } catch (error) {
        throw new HttpError("Error al obtener los circuitos comunales.", 500, "get_communalcircuit_failed", {field: "Error en el archivo: CommunalCircuit"});
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
        updatedAt: communalCircuit.updatedOn,
        deletionDate: communalCircuit.deletionDate,
        parish: communalCircuit.parish
      }
    }));

    return {
      type: "FeatureCollection",
      features
    };

  } catch (error) {
    throw new HttpError("Error al obtener los circuitos comunales en formato GeoJSON.", 500, "get_communalcircuit_geojson_failed", {field: "Error en el archivo: CommunalCircuit"});
  }
}

// get communal circuit by ID
export const getById = async (id: number):Promise<CommunalCircuit | null> =>{
    try {
        if (!id) {
            throw new HttpError("ID de circuito comunal requerido", 400, "Missing_id", {field: "id"});
        }

        const communalCircuit = await CommunalCircuit.findOne({
            where: {id}
        })

        if (!communalCircuit) {
            throw new HttpError("Circuito comunal no encontrado", 404, "Not_found", {field: "id"});
        }

        return communalCircuit;
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }else{
            throw new HttpError("Error al obtener el circuito comunal.", 500, "get_communalcircuit_failed", {field: "Error en el archivo: CommunalCircuit"});
        }
    }    
}

// get communal circuit GeoJson by ID
export const getByIdGeoJson = async (id: number):Promise<CommunalCircuit | null> =>{
    try {
        if (!id) {
            throw new HttpError("ID de circuito comunal requerido", 400, "Missing_id", {field: "id"});
        }

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
            throw new HttpError("Circuito comunal no encontrado", 404, "Not_found", {field: "id"});
        }

        return communalCircuit;
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }else{
            throw new HttpError("Error al obtener circuito comunal, intente nuevamente.", 500, "get_communalcircuit_failed", {field: "Error en el archivo: CommunalCircuit"});
        }
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
            throw new HttpError("El circuito comunal ya existe.", 400, "communalcircuit_already_exists", {field: "name parishId"});
        }

        const createCommunalCircuit = await CommunalCircuit.create({
            name,
            parishId,
            addres,
            code,
            boundary,
            metadata
        })

        if (!createCommunalCircuit) {
            throw new HttpError("Error al crear el circuito comunal, intente nuevamente.", 500, "create_communalcircuit_failed", {field: "Error en el archivo: CommunalCircuit"});
        }

        return createCommunalCircuit;
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }else{
            throw new HttpError("Error al crear el circuito comunal, intente nuevamente.", 500, "create_communalcircuit_failed", {field: "Error en el archivo: CommunalCircuit"});
        }
    }
}

//update comunalCircuit
export const updateComunalCircuit = async(updates: Partial<CommunalCircuit>): Promise<CommunalCircuit | null> =>{
    try {
        const existParish = await Parish.findOne({where: {id: updates.parishId}})
        if (!existParish) {
            throw new HttpError("El ID de la parroquia no existe.", 404, "Not_found", {field: "parishId"});
        }

        const updateToCommunalCircuit = await CommunalCircuit.findOne({where:{id: updates.id}})

        if (!updateToCommunalCircuit) {
            throw new HttpError("Circuito comunal no encontrado.", 404, "Not_found", {field: "id"});
        }

        await updateToCommunalCircuit.update(updates)

        return updateToCommunalCircuit;
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }else{
            throw new HttpError("Error al actualizar el circuito comunal, intente nuevamente.", 500, "update_communalcircuit_failed", {field: "Error en el archivo: CommunalCircuit"});
        }
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
        throw new HttpError("Error al eliminar el circuito comunal", 500, "delete_communalcircuit_failed", {field: "Error en el archivo: CommunalCircuit"});
    }
}