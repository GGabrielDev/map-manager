import { Op, OrderItem } from "sequelize";
import { 
    Organism, 
    Responsible,
 } from "@/models";

interface PaginationOptions {
  page: number
  pageSize: number
}

export const SortByOptions = ['name', 'creationDate', 'updatedOn']
export const SortOrderOptions = ['ASC', 'DESC']

export interface OrganismFilterOptions extends PaginationOptions {
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
}:OrganismFilterOptions): Promise<PaginatedResult<Organism>> => {
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

        const data = await Organism.findAll({
            where,
            offset,
            limit: pageSize,
            order,
            include: [Responsible]
        });

        const total = await Organism.count({ where })

        return {
            data,
            total,
            totalPages: Math.ceil(total / pageSize),
            currentPage: page
        };
    } catch (error) {
        throw new Error("Error al obtener los organismos, intente nuevamente.");
    }
}

// Get Organism by ID
export const getById = async (id: number): Promise<Organism | null> => {
    try {
        const organism = await Organism.findOne({
            where: { id },
            include: [Responsible]
        });

        if (!Organism) {
            throw new Error("Organismo no encontrado.");
        }

        return organism;
    } catch (error) {
        throw new Error("Error al obtener el organismo, intente nuevamente.");
    }
}

// Create Organism
export const createOrganism = async (name: string): Promise<Organism> => {
    try {
        const existOrganism = await Organism.findOne({ where: { name } });

        if (existOrganism) {
            throw new Error("El organismo ya existe.");
        }

        const createOrganism = await Organism.create({
            name
        });

        return createOrganism;

    } catch (error) {
        throw new Error("Error al crear el organismo, intente nuevamente.");
    }
}

// Update Organism
export const updateOrganism = async (updates: Partial<Organism>): Promise<Organism | null> => {
    try {
        const updateOrganism = await Organism.findOne({ where: { id: updates.id } });

        if (!updateOrganism) {
            throw new Error("Organismo no encontrado.");
        }

        await updateOrganism.update(updates);

        return updateOrganism;
    } catch (error) {
        throw new Error("Error al actualizar el organismo, intente nuevamente.");
    }
}

// Delete Organism
export const deleteOrganism = async (id: number): Promise<boolean> => {
    try {
        const organism = await Organism.findOne({ where: { id } });

        if (!organism) {
            return false;
        }

        const countResponsible = await Responsible.count({ where: { organismId: id } });
        if (countResponsible > 0) {
            throw new Error("No se puede eliminar el organismo, ya que tiene responsables asociadas.");
        }

        await organism.destroy();
        return true;
    } catch (error) {
        throw new Error("Error al eliminar el organismo, intente nuevamente.");
    }
}