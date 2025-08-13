/*import { CommunalCircuit, Parish } from "@/models";
import { Op, OrderItem } from "sequelize";

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
        throw new Error("Error al obtener los circuitos comunitarios, intente nuevamente.");
    }
}

// get communal circuit by ID
export const getById = async (id: number):Promise<CommunalCircuit | null> =>{
    try {
        const communalCircuit = await CommunalCircuit.findOne({
            where: {id}
        })

        if (!communalCircuit) {
            throw new Error("Circuito comunitario no encontrado");
        }

        return communalCircuit;
    } catch (error) {
        throw new Error("Error al obtener circuito comunitario, intente nuevamente.")
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
            throw new Error("El circuito comunitario ya existe.")
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
        throw new Error("Error al crear el circuito comunitario, intente nuevamente.")
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
}*/