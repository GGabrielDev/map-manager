import { Request, Response } from 'express';
import { User, Role, Permission } from "@/models/";

// All Roles
export const AllRoles = async (req: Request, res: Response): Promise<void> => {
    try {
        const AllRoles = await Role.findAll({});

        if (!AllRoles) {
            res.status(404).json({ mensaje: 'Error de consulta, intente nuevamente.' });
            return;
        }

        res.send(AllRoles);
    } catch (error) {
        res.status(404).json({ mensaje: "Error de consulta, intente nuevamente." });
    }
}

// Get a Role By Id
type SearchRoleByIdParams = { id: number };
export const SearchRoleById = async (req: Request<SearchRoleByIdParams>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const SearchRoleById = await Role.findOne({
            where: { id },
            include: [Role.RELATIONS.PERMISSIONS],
        });

        res.json(SearchRoleById);
    } catch (error) {
        res.status(404).json({ mensaje: "Error al buscar rol, intente nuevamente." });
        return;
    }
}

type CreateRoleBody = { name: string; description: string; userId?: number[], permissionId?: number[] };
export const CreateRoles = async (req: Request<{}, {}, CreateRoleBody>, res: Response): Promise<void> => {
    try {
        const { name, description, userId, permissionId } = req.body;

        const ExistRole = await Role.findOne({ where: { name } });
        if (ExistRole) {
            res.status(400).json({ mensaje: "El rol ya existe." });
            return;
        }

        const CreateRoles = await Role.create({
            name,
            description,
        });

        if (permissionId && permissionId.length > 0) {
            const permissions = await Permission.findAll({ where: { id: permissionId } });
            await CreateRoles.$set(Role.RELATIONS.PERMISSIONS, permissions);
        }

        res.send(CreateRoles);
    
    } catch (error) {
        res.status(404).json({ mensaje: "Error al registrar rol, intente nuevamente." });
        return;
    }
}

// Update a Role
type UpdateRolesParams = { id: number };
type UpdateRolesBody = {
    name?: string;
    description?: string;
    userId?: number[];
    permissionId?: number[];
};

export const UpdateRoles = async (
    req: Request<UpdateRolesParams, {}, UpdateRolesBody>,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, description, userId, permissionId } = req.body;

        const UpdateRoles = await Role.findByPk(id);
        if (!UpdateRoles) {
            res.status(404).json({ mensaje: "Rol no encontrado" });
            return;
        }

        UpdateRoles.set(req.body);
        await UpdateRoles.save();

        if (permissionId && permissionId.length > 0) {
            const permissions = await Permission.findAll({ where: { id: permissionId } });
            await UpdateRoles.$set(Role.RELATIONS.PERMISSIONS, permissions);
        }

        const UpdatedRoles = await Role.findByPk(id, {
            include: [Role.RELATIONS.PERMISSIONS],
        });

        res.json(UpdatedRoles);
    } catch (error) {
        res.status(404).json({ mensaje: "Error al actualizar usuario,intente nuevamente." });
    }
}

type DeleteRolesParams = { id: number };

export const DeleteRoles = async (
    req: Request<DeleteRolesParams>,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        await Role.destroy({
            where: { id },
        });

        res.sendStatus(200);
    } catch (error) {
        res.status(404).json({ mensaje: "Error al eliminar usuario" });
    }
}