import { Op, OrderItem } from "sequelize";
import { Responsible, Organism } from "@/models";

interface PaginationOptions {
  page: number
  pageSize: number
}

export const SortByOptions = ['firstName', 'creationDate', 'updatedOn']
export const SortOrderOptions = ['ASC', 'DESC']

export interface ResponsibleFilterOptions extends PaginationOptions {
  firstName?: string
  lastName?: string
  organismName?: string
  sortBy?: (typeof SortByOptions)[number]
  sortOrder?: (typeof SortOrderOptions)[number]
}

interface PaginatedResult<T> {
  data: T[]
  total: number
  totalPages: number
  currentPage: number
}

// All Responsible
export const allRespnsible = async ({
    page,
    pageSize,
    firstName,
    lastName,
    organismName,
    sortBy,
    sortOrder = 'ASC'
}:ResponsibleFilterOptions): Promise<PaginatedResult<Responsible>> => {
    try {
        if (page < 1 || pageSize <1) {
            return {data: [], total: 0, totalPages: 0, currentPage: page}
        }

        const offset = (page - 1) * pageSize
        const andConditions: any[]= []

        // filter by firstName and lastName
        if (firstName) {
            andConditions.push({ firstName: {[Op.iLike]: `%${firstName}%`} })
        }
        if (lastName) {
            andConditions.push({ lastName: {[Op.like]: `%${lastName}%`} })
        }

        const where = andConditions.length ? {[Op.and]: andConditions}: undefined

        const includeOptions: any ={
            model: Organism,
            as: 'organism',
            required: false
        }
        if (organismName) {
            includeOptions.where ={
                name: {[Op.iLike]: `%${organismName}%`}
            }
            includeOptions.required = true
        }

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

        const data = await Responsible.findAll({
            where,
            offset,
            limit: pageSize,
            order,
            include: [
                includeOptions
            ]
        });

        const total = await Responsible.count({ where })

        return {
            data,
            total,
            totalPages: Math.ceil(total / pageSize),
            currentPage: page
        };
    } catch (error) {
        throw new Error("Error al obtener los responsables, intente nuevamente.");
    }
}

// Get Responsible by ID
export const getById = async (id: number): Promise<Responsible | null> => {
    try {
        const responsible = await Responsible.findOne({
            where: { id },
            include: [
                {
                    model: Organism,
                    as: 'organism'
                }
            ]
        });

        if (!responsible) {
            throw new Error("Responsable no encontrado.");
        }

        return responsible;
    } catch (error) {
        throw new Error("Error al obtener el responsable, intente nuevamente.");
    }
}

// Create Responsible
export const createResponsible = async (
    firstName: string,
    lastName: string,
    ci: string,
    phone: string,
    position: string,
    phoneBackup?: string,
    email?: string,
    organismId?: number,
    ): Promise<Responsible> => {
    try {
        if (organismId){
            const existOrganism = await Organism.findOne({where:{id: organismId}})
            if (!existOrganism) {
                throw new Error ("El ID del organismo no existe")
            }
        }

        const createResponsible = await Responsible.create({
            firstName,
            lastName,
            ci,
            phone,
            phoneBackup,
            email,
            position,
            organismId,
        });

        return createResponsible;
    } catch (error) {
        throw new Error("Error al registrar el responsable, intente nuevamente.");
    }
}

// Update Responsible
export const updateResponsible = async (updates: Partial<Responsible>): Promise<Responsible | null> => {
    try {
        if (updates.organismId) {
            const existOrganism = await Organism.findOne({where:{id: updates.organismId}})
            if (!existOrganism) {
                throw new Error ("El ID del organismo no existe")
            }
        }
        
        const updateToResponsible = await Responsible.findOne({ where: { id: updates.id } });

        if (!updateToResponsible) {
            throw new Error("Responsable no encontrado.");
        }

        await updateToResponsible.update(updates);

        return updateToResponsible;
    } catch (error) {
        throw new Error("Error al actualizar el responsable, intente nuevamente.");
    }
}

// Delete Responsible
export const deleteResponsible = async (id: number): Promise<boolean> => {
    try {
        const responsible = await Responsible.findOne({ where: { id } });

        if (!responsible) {
            return false;
        }

        await responsible.destroy();
        return true;
    } catch (error) {
        throw new Error("Error al eliminar el responsable, intente nuevamente.");
    }
}