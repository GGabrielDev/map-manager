import { Permission } from "@/models/";

// All Permissions
export const allPermissions = async (): Promise<Permission[]> => {
    try {
        const allPermissions = await Permission.findAll({});

        if (!allPermissions) {
            throw new Error('Error de consulta, intente nuevamente.');
        }

        return allPermissions;
    } catch (error) {
        throw new Error("Error de consulta, intente nuevamente.");
    }
}

// Get a Permission By Id
export const searchPermissionById = async (id: number): Promise<Permission | null> => {
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