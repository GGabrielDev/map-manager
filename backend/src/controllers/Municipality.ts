import { Op, OrderItem } from "sequelize";
import { Municipality, Parish, State } from "@/models";

import { HttpError } from "@/utils/error-utils";

interface PaginationOptions {
  page: number
  pageSize: number
}

export const SortByOptions = ['name', 'creationDate', 'updatedOn']
export const SortOrderOptions = ['ASC', 'DESC']

export interface MunicipalityFilterOptions extends PaginationOptions {
  name?: string
  sortBy?: (typeof SortByOptions)[number]
  sortOrder?: (typeof SortOrderOptions)[number]
}

interface PaginatedResult<T> {
  data: T[]
  total: number
  totalPages: number
  currentPage: number
}

// All Municipalities
export const allMunicipalities = async ({
    page,
    pageSize,
    name,
    sortBy,
    sortOrder = 'ASC'
}:MunicipalityFilterOptions): Promise<PaginatedResult<Municipality>> => {
    try {
        if (page < 1 || pageSize <1) {
            return {data: [], total: 0, totalPages: 0, currentPage: page}
        }

        const offset = (page - 1) * pageSize
        const andConditions: any[]= []

        // filter by name
        if (name) {
            andConditions.push({ name: {[Op.like]: `%${name}%`} })
        }

        const where = andConditions.length ? {[Op.and]: andConditions}: undefined

        let order: OrderItem[] | undefined = undefined
        if (sortBy) {
            const column = 
            sortBy === 'creationDate'
                ? 'creationDate'
                :sortBy === 'updatedOn'
                    ? 'updateOn'
                    : 'name'
            order = [[column, sortOrder]]
        }

        const data = await Municipality.findAll({
            where,
            offset,
            limit: pageSize,
            order,
            include: [
                {
                    model: State,
                    as: 'state'
                },
                {
                    model: Parish,
                    as: 'parishes'
                }
            ]
        });

        if(!data){
            throw new HttpError("No se encontraron municipios", 404, "municipality_not_found", {field: "Error en el archivo: municipality"});
        }

        const total = await Municipality.count({ where })

        return {
            data,
            total,
            totalPages: Math.ceil(total / pageSize),
            currentPage: page
        };
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }else{
            throw new HttpError("Error al obtener los municipios, intente nuevamente.", 500, "municipality_fetch_failed", {field: "Error en el archivo: municipality"});
        }
    }
}

// Get Municipality by ID
export const getById = async (id: number): Promise<Municipality | null> => {
    try {
        if (!id) {
            throw new HttpError("ID de municipio requerido", 400, "missing_municipality_id", {field: "id"});
        }

        const municipality = await Municipality.findOne({
            where: { id },
            include: [
                {
                    model: State,
                    as: 'state'
                },
                {
                    model: Parish,
                    as: 'parishes'
                }
            ]
        });

        if (!municipality) {
            throw new HttpError("Municipio no encontrado", 404, "municipality_not_found", {field: "id"});
        }

        return municipality;
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        } else {
            throw new HttpError("Error al obtener el municipio, intente nuevamente.", 500, "municipality_fetch_failed", {field: "Error en el archivo: municipality"});
        }
    }
}

// Create Municipality
export const createMunicipality = async (name: string, stateId: number): Promise<Municipality> => {
    try {
        const existMunicipality = await Municipality.findOne({ where: { name, stateId } });

        if (existMunicipality) {
            throw new HttpError("El municipio ya existe.", 400, "municipality_already_exists", {field: "name, stateId"});
        }

        const createMunicipality = await Municipality.create({
            name,
            stateId
        });

        if (!createMunicipality) {
            throw new HttpError("Error al crear el municipio, intente nuevamente.", 500, "municipality_creation_failed", {field: "Error en el archivo: municipality"});
        }

        return createMunicipality;
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        } else {
            throw new HttpError("Error al crear el municipio, intente nuevamente.", 500, "municipality_creation_failed", {field: "Error en el archivo: municipality"});
        }
    }
}

// Update Municipality
export const updateMunicipality = async (updates: Partial<Municipality>): Promise<Municipality | null> => {
    try {
        const existState = await State.findOne({where: {id: updates.stateId}})
        if (!existState) {
            throw new HttpError("El ID del estado no existe", 400, "missing_state_id", {field: "stateId"});
        }

        const updateToMunicipality = await Municipality.findOne({ where: { id: updates.id } });

        if (!updateToMunicipality) {
            throw new HttpError("Municipio no encontrado", 404, "municipality_not_found", {field: "id"});
        }

        await updateToMunicipality.update(updates);

        return updateToMunicipality;
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        } else {
            throw new HttpError("Error al actualizar el municipio, intente nuevamente.", 500, "municipality_update_failed", {field: "Error en el archivo: municipality"});
        }
    }
}

// Delete Municipality
export const deleteMunicipality = async (id: number): Promise<boolean> => {
    try {
        const municipality = await Municipality.findOne({ where: { id } });

        if (!municipality) {
            return false;
        }

        const countParish = await Parish.count({ where: { municipalityId: id } });
        if (countParish > 0) {
            throw new HttpError("No se puede eliminar el municipio, ya que tiene parroquias asociadas.", 400, "municipality_has_parishes", {field: "id"});
        }

        await municipality.destroy();
        return true;
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }else{
            throw new HttpError("Error al eliminar el municipio, intente nuevamente.", 500, "municipality_deletion_failed", {field: "Error en el archivo: municipality"});
        }
    }
}
