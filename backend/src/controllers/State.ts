import { State, Municipality } from "@/models";
import { Op, OrderItem } from "sequelize";

interface PaginationOptions {
  page: number
  pageSize: number
}

export const SortByOptions = ['name', 'creationDate', 'updatedOn']
export const SortOrderOptions = ['ASC', 'DESC']

export interface StateFilterOptions extends PaginationOptions {
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

// All States
export const allStates = async ({
    page,
    pageSize,
    name,
    sortBy,
    sortOrder = 'ASC'
}:StateFilterOptions): Promise<PaginatedResult<State>> => {
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
                    ? 'updatedOn'
                    : 'name'
            order = [[column, sortOrder]]
        }

        const data = await State.findAll({
            where,
            offset,
            limit: pageSize,
            order,
            include: [Municipality]
        });

        const total = await State.count({ where })

        return {
            data,
            total,
            totalPages: Math.ceil(total / pageSize),
            currentPage: page
        };
    } catch (error) {
        throw new Error("Error al obtener los estados, intente nuevamente.");
    }
}

// Get State by ID
export const getById = async (id: number): Promise<State | null> => {
    try {
        const state = await State.findOne({
            where: { id },
            include: [Municipality]
        });

        if (!state) {
            throw new Error("Estado no encontrado.");
        }

        return state;
    } catch (error) {
        throw new Error("Error al obtener el estado, intente nuevamente.");
    }
}

// Create State
export const createState = async (name:string): Promise<State> => {
    try {
        const existState = await State.findOne({ where: { name } });

        if (existState) {
            throw new Error("El estado ya existe.");
        }

        const createState = await State.create({
            name,
        })

        return createState;

    } catch (error) {
        throw new Error("Error al crear el estado, intente nuevamente.");
    }
}

// Update State
export const updateState = async (updates: Partial<State>): Promise<State | null> => {
    try {
        const updateToState = await State.findOne({ where: { id: updates.id } });

        if (!updateToState) {
            throw new Error("Estado no encontrado.");
        }

        await updateToState.update(updates);

        return updateToState;
    } catch (error) {
        throw new Error("Error al actualizar el estado, intente nuevamente.");
    }
}

//Delete States
export const deleteState = async (id: number): Promise<boolean> => {
    try {
        const state = await State.findOne({ where: { id } });

        if (!state) {
            return false;
        }

        const countMunicipalities = await Municipality.count({ where: { stateId: id } });
        if (countMunicipalities > 0) {
            throw new Error("No se puede eliminar el estado, ya que tiene municipios asociados.");
        }

        await state.destroy();
        return true;
    } catch (error) {
        throw new Error("Error al eliminar el estado, intente nuevamente.");
    }
}
