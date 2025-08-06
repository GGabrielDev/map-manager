import { Request, Response } from 'express';
import { Role } from "@/models/";

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

type SearchRolesByIdParams = { id: string };

export const SearchRolesById = async (req: Request<SearchRolesByIdParams>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const SearchRolesById = await Role.findOne({
            where: { id }
        });

        if (!SearchRolesById) {
            res.status(404).json({ mensaje: 'Error al buscar rol, intente nuevamente.' });
            return;
        }

        res.json(SearchRolesById);
    } catch (error) {
        res.status(404).json({ mensaje: "Error al buscar rol, intente nuevamente." });
        return;
    }
}

type CreateRolesBody = { name: string; description: string; };

export const CreateRoles = async (req: Request<{}, {}, CreateRolesBody>, res: Response): Promise<void> => {
    try {
        const { name, description } = req.body;

        const ExistRole = await Role.findOne({ where: { name } });
        if (ExistRole) {
            res.status(400).json({ mensaje: "El rol ya existe." });
            return;
        }

        const CreateRoles = await Role.create({
            name,
            description,
        });

        res.send(CreateRoles);
    } catch (error) {
        res.status(404).json({ mensaje: "Error al registrar rol, intente nuevamente." });
        return;
    }
}

type UpdateRolesParams = { id: string };
type UpdateRolesBody = {
    name?: string;
    description?: string;
};

export const UpdateRoles = async (
    req: Request<UpdateRolesParams, {}, UpdateRolesBody>,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const UpdateRoles = await Role.findByPk(id);
        if (!UpdateRoles) {
            res.status(404).json({ mensaje: "Rol no encontrado" });
            return;
        }

        UpdateRoles.set(req.body);
        await UpdateRoles.save();

        res.json(UpdateRoles);
    } catch (error) {
        res.status(404).json({ mensaje: "Error al actualizar rol,intente nuevamente." });
    }
}

type DeleteRoleParams = { id: string };

export const DeleteRole = async (
    req: Request<DeleteRoleParams>,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        await Role.destroy({
            where: { id },
        });

        res.sendStatus(200);
    } catch (error) {
        res.status(404).json({ mensaje: "error al eliminar Role" });
    }
}