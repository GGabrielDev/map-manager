import { Op, OrderItem } from "sequelize";
import { Organism, Responsible } from "@/models";

import sharp from "sharp";
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
export const createOrganism = async (name: string, icono:string): Promise<Organism> => {
    try {
        const existOrganism = await Organism.findOne({ where: { name } });

        if (existOrganism) {
            throw new Error("El organismo ya existe.");
        }

        const createOrganism = await Organism.create({
            name,
            icono
        });

        return createOrganism;
    } catch (error) {
        console.log(error)
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



//funciones no CRUD
export const validateImage = async (name: string, file: Express.Multer.File): Promise<string> => {
    try {
        const allowedTypes = ["image/jpeg", "image/png"];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new Error("Tipo de archivo no permitido.");
        }

        const ext = path.extname(file.originalname);
        const newFileName = `${name}${ext}`;


        const destDir = path.join(__dirname, "../../../static/organism");
        const destPath = path.join(destDir, newFileName);

        //Asegurar que la carpeta exista
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        // Leer metadatos para saber dimensiones originales
        const metadata = await sharp(file.path).metadata();

        if (metadata.width !== 16 || metadata.height !== 16) {
            // Si no es 16x16, redimensionar manteniendo proporción, ajustando a 16x16 con fondo transparente
            await sharp(file.path)
                .resize(16, 16, {
                    fit: 'contain',
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                })
                .toFile(destPath);
        } else {
            // Si ya es 16x16, solo mover el archivo sin cambiarlo
            fs.renameSync(file.path, destPath);
        }

        //guardar la ruta local con el archivo "nuevo"
        const icono = `/static/organisms/icono/${newFileName}`;

        return icono;
    } catch (error) {
        throw new Error("Error al validar la imagen, intente nuevamente.");
    }
}
