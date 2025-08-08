import { Permission } from "@/models";

// TODO: Check para Jhonattan para que revise el codigo de paginación y los cambios

interface PaginationOptions {
  page: number
  pageSize: number
}

interface PaginatedResult<T> {
  data: T[]
  total: number
  totalPages: number
  currentPage: number
}

// All Permissions
export const getAll = async ({page, pageSize}: PaginationOptions): Promise<PaginatedResult<Permission>> => {
    if (page < 1 || pageSize < 1) {
      return {
        data: [],
        total: 0,
        totalPages: 0,
        currentPage: page,
      }
    }

    const offset = (page - 1) * pageSize
    const { count, rows } = await Permission.findAndCountAll({
      offset,
      limit: pageSize,
    })

    return {
      data: rows,
      total: count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: page,
    }
}

// Get a Permission By Id
export const getById = async (id: number): Promise<Permission | null> => {
    try {
        const searchPermissionById = await Permission.findOne({
            where: { id }
        });

        if (!searchPermissionById) {
            throw new Error('Error al buscar permiso, intente nuevamente.');
        }

        return searchPermissionById;
    } catch (error) {
        throw new Error("Error al buscar permiso, intente nuevamente.");
    }
}
