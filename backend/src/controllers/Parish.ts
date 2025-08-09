import { Parish } from "@/models";
import { Op, OrderItem } from "sequelize";

interface PaginationOpstions{
    page: number
    pageSize: number
}

export const SortByOptions = ['name', 'creationDate', 'updateDate']
export const SortOrderOptions = ['ASC', 'DESC']

export interface ParishFilterOptions extends PaginationOpstions {
    name?: string
    sortBy?: (typeof SortByOptions)[number]
    sortOrder?:(typeof SortOrderOptions)[number]
}

interface PaginatedResult<T> {
    data: T[]
    total: number
    totalPage: number
    currentPage: number
}

//All Parish
export const allParish = async({
    page,
    pageSize,
    name,
    sortBy,
    sortOrder= 'ASC'
}:ParishFilterOptions):Promise<PaginatedResult<Parish>> =>{
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

        const data = await Parish.findAll({
            where,
            offset,
            limit: pageSize,
            order,
        })

        const total = await Parish.count({where})

        return {
            data,
            total,
            totalPage: Math.ceil(total / pageSize,),
            currentPage: page
        }
    } catch (error) {
        throw new Error("Error al obtener las parroquias, intente nuevamente.");
    }
}

// git parish by ID

export const getById = async (id: number):Promise<Parish | null> =>{
    try {
        const parish = await Parish.findOne({
            where: {id}
        })

        if (!parish) {
            throw new Error("Parroquia no encontrada");
        }

        return parish;
    } catch (error) {
        throw new Error("Error al obtener parroquia, intente nuevamente.")
    }    
}