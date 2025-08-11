import { Quadrant, Parish, Organism } from "@/models";
import { Op, OrderItem, QueryError } from "sequelize";

interface PaginationOpstions{
    page: number
    pageSize: number
}

export const SortByOptions = ['name', 'creationDate', 'updateDate']
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
            :sortBy === 'updateOn'
                ? 'updateOn'
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
            ]
        })

        const total = await Parish.count({where})

        return {
            data,
            total,
            totalPage: Math.ceil(total / pageSize,),
            currentPage: page
        }
    } catch (error) {
        throw new Error("Error al obtener los cuadrantes, intente nuevamente.");
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

//create quadrant
export const createQuadrant = async (
    name: string,
    parishId: number,
    organismId: number,
    boundary: object,
    fleet: {
        small: {active: number; inactive: number};
        big: {active: number; inactive: number};
        bike: {active: number; inactive: number};
    },
    metadata?: object
): Promise<Quadrant> =>{
    try {
        const existQudarant = await Quadrant.findOne({where: {name, parishId, organismId,}})

        if (existQudarant) {
            throw new Error("La parroquia ya existe.")
        }

        const createQuadrant = await Quadrant.create({
            name,
            parishId,
            organismId,
            boundary,
            fleet,
            metadata
        })

        return createQuadrant;
    } catch (error) {
        throw new Error("Error al crear la parroquia, intente nuevamente.")
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
        throw new Error("Error al actualizar la cuadrante.")
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