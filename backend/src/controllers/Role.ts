import { Role, Permission } from "@/models/";

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

// All Roles
export const getAll = async ({page, pageSize}: PaginationOptions): Promise<PaginatedResult<Role>> => {
    if (page < 1 || pageSize < 1) {
      return {
        data: [],
        total: 0,
        totalPages: 0,
        currentPage: page,
      }
    }

    const offset = (page - 1) * pageSize
    const { count, rows } = await Role.findAndCountAll({
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

// Get a Role By Id
export const getById = async (id: number): Promise<Role | null> => {
    try {
        const searchRoleById = await Role.findByPk(id, {
            include: [Role.RELATIONS.PERMISSIONS],
        });

        if (!searchRoleById) {
            throw new Error("Rol no encontrado.");
        }

        return searchRoleById;
    } catch (error) {
        throw new Error("Error al buscar rol, intente nuevamente.");
    }
}

export const createRole = async (name: string, description: string, permissionIds: number[]): Promise<Role> => {
    try {
        const existRole = await Role.findOne({ where: { name } });
        if (existRole) {
            throw new Error("El rol ya existe.");
        }

        const createRoles = await Role.create({
            name,
            description,
        });

        if (permissionIds && permissionIds.length > 0) {
            const permissions = await Permission.findAll({ where: { id: permissionIds } });
            await createRoles.$set(Role.RELATIONS.PERMISSIONS, permissions);
        }

       return createRoles;

    } catch (error) {
        throw new Error("Error al registrar rol, intente nuevamente.");
    }
}

// Update a Role
export const updateRole = async (updates: Partial<Role>, permissionIds: number[]): Promise<Role | null> => {
    try {
        const updateToRole = await Role.findByPk(updates.id);
        if (!updateToRole) {
            throw new Error("Rol no encontrado");
        }

        await updateToRole.update(updates, {where: {id: updates.id}});

        if (permissionIds.length > 0) {
            const permissions = await Permission.findAll({ where: { id: permissionIds } });
            await updateToRole.$set(Role.RELATIONS.PERMISSIONS, permissions);
        }

        const updatedToRole = await Role.findByPk(updates.id, {
            include: [Role.RELATIONS.PERMISSIONS],
        });

        return updatedToRole;
    } catch (error) {
        throw new Error("Error al actualizar rol, intente nuevamente.");
    }
}

export const deleteRole = async (id: number): Promise<boolean> => {
    try {
        const roleToDelete = await Role.findByPk(id);
        if (!roleToDelete) {
            return false;
        }

        await Role.destroy({
            where: { id },
        });

        return true;
    } catch (error) {
        throw new Error("Error al eliminar rol, intente nuevamente.");
    }
}
