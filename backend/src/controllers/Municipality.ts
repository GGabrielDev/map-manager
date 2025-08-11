import { Op, OrderItem } from "sequelize";
import { Municipality, Parish, State } from "@/models";

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

        const total = await Municipality.count({ where })

        return {
            data,
            total,
            totalPages: Math.ceil(total / pageSize),
            currentPage: page
        };
    } catch (error) {
        throw new Error("Error al obtener los municipios, intente nuevamente.");
    }
}

// Get Municipality by ID
export const getById = async (id: number): Promise<Municipality | null> => {
    try {
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
            throw new Error("Municipio no encontrado.");
        }

        return municipality;
    } catch (error) {
        throw new Error("Error al obtener el municipio, intente nuevamente.");
    }
}

// Create Municipality
export const createMunicipality = async (name: string, stateId: number): Promise<Municipality> => {
    try {
        const existMunicipality = await Municipality.findOne({ where: { name, stateId } });

        if (existMunicipality) {
            throw new Error("El municipio ya existe.");
        }

        const createMunicipality = await Municipality.create({
            name,
            stateId
        });

        return createMunicipality;

    } catch (error) {
        throw new Error("Error al crear el municipio, intente nuevamente.");
    }
}

// Update Municipality
export const updateMunicipality = async (updates: Partial<Municipality>): Promise<Municipality | null> => {
    try {
        const existState = await State.findOne({where: {id: updates.stateId}})
        if (!existState) {
            throw new Error("El ID del estado no existe")
        }

        const updateToMunicipality = await Municipality.findOne({ where: { id: updates.id } });

        if (!updateToMunicipality) {
            throw new Error("Municipio no encontrado.");
        }

        await updateToMunicipality.update(updates);

        return updateToMunicipality;
    } catch (error) {
        throw new Error("Error al actualizar el municipio, intente nuevamente.");
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
            throw new Error("No se puede eliminar el municipio, ya que tiene parroquias asociadas.");
        }

        await municipality.destroy();
        return true;
    } catch (error) {
        throw new Error("Error al eliminar el municipio, intente nuevamente.");
    }
}
