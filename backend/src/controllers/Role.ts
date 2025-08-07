import { User, Role, Permission } from "@/models/";

// All Roles
export const allRoles = async (): Promise<Role[]> => {
    try {
        const allRoles = await Role.findAll({});

        if (!allRoles) {
            throw new Error ('Error de consulta, intente nuevamente.');
        }

        return allRoles;
    } catch (error) {
        throw new Error("Error de consulta, intente nuevamente.");
    }
}

// Get a Role By Id
export const searchRoleById = async (id: number): Promise<Role | null> => {
    try {
        const searchRoleById = await Role.findOne({
            where: { id },
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