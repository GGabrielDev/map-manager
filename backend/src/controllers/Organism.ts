import { Op, OrderItem } from "sequelize";
import { Organism, Responsible } from "@/models";

import { HttpError } from "@/utils/error-utils";

import path from "path";
import fs from "fs";

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

// All Organism
export const allOrganism = async ({
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
                    ? 'updatedOn'
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

        if(!data){
            throw new HttpError("No se encontraron organismos.", 404, "organism_not_found", {field: "id"});
        }

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

        if (!organism) {
            throw new HttpError("Organismo no encontrado.", 404, "organism_not_found", {field: "id"});
        }

        return organism;
    } catch (error) {
        if (error instanceof HttpError) {
            throw error
        } else {
            throw new HttpError("Error al obtener el organismo, intente nuevamente.", 500, "organism_fetch_failed", {field: "Error en el archivo: organism"});
        }
    }
}

// Create Organism
export const createOrganism = async (name: string, icono:string): Promise<Organism> => {
    try {
        const existOrganism = await Organism.findOne({ where: { name } });

        if (existOrganism) {
            throw new HttpError("El organismo ya existe.", 400, "organism_already_exists", {field: "name"});
        }

        const createOrganism = await Organism.create({
            name,
            icono
        });

        if (!createOrganism) {
            throw new HttpError("Error al crear el organismo, intente nuevamente.", 500, "organism_creation_failed", {field: "Error en el archivo: organism"});
        }

        return createOrganism;
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }else{
            throw new HttpError("Error al crear el organismo, intente nuevamente.", 500, "organism_creation_failed", {field: "Error en el archivo: organism"});
        }
    }
}

// Update Organism
export const updateOrganism = async (updates: Partial<Organism>): Promise<Organism | null> => {
    try {
        const updateOrganism = await Organism.findOne({ where: { id: updates.id } });

        if (!updateOrganism) {
            throw new HttpError("Organismo no encontrado.", 404, "organism_not_found", {field: "id"});
        }

        await updateOrganism.update(updates);
        return updateOrganism;
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        } else {
            throw new HttpError("Error al actualizar el organismo, intente nuevamente.", 500, "organism_update_failed", {field: "Error en el archivo: organism"});
        }
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
            throw new HttpError("No se puede eliminar el organismo, ya que tiene responsables asociadas.", 400, "organism_has_responsibles", {field: "id"});
        }

        await organism.destroy();
        return true;
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }else{
            throw new HttpError("Error al eliminar el organismo, intente nuevamente.", 500, "organism_deletion_failed", {field: "Error en el archivo: organism"});
        }
    }
}



//funciones no CRUD
export const validateImage = async (name: string, file: Express.Multer.File): Promise<string> => {
    try {
        const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml"];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new HttpError("Tipo de archivo no permitido.", 400, "invalid_file_type", {field: "file"});
        }

        const ext = path.extname(file.originalname);
        const newFileName = `${name}${ext}`;


        const destDir = path.join(__dirname, "../../../static/organism");
        const destPath = path.join(destDir, newFileName);

        //Asegurar que la carpeta exista
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        // Mover el archivo sin cambiarlo
        fs.renameSync(file.path, destPath);

        //guardar la ruta local con el archivo "nuevo"
        const icono = `api/static/organisms/icono/${newFileName}`;

        return icono;
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }else{
            throw new HttpError("Error al validar la imagen.", 500, "image_validation_failed", {field: "file"});
        }
    }
}