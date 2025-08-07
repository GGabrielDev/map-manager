import { Request, Response } from 'express';
import { Permission } from "@/models/";

// All Permissions
export const AllPermissions = async (req: Request, res: Response): Promise<void> => {
    try {
        const AllPermissions = await Permission.findAll({});

        if (!AllPermissions) {
            res.status(404).json({ mensaje: 'Error de consulta, intente nuevamente.' });
            return;
        }

        res.send(AllPermissions);
    } catch (error) {
        res.status(404).json({ mensaje: "Error de consulta, intente nuevamente." });
    }
}

// Get a Permission By Id
type SearchPermissionByIdParams = { id: number };
export const SearchPermissionById = async (req: Request<SearchPermissionByIdParams>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const SearchPermissionById = await Permission.findOne({
            where: { id }
        });

        if (!SearchPermissionById) {
            res.status(404).json({ mensaje: 'Error al buscar permiso, intente nuevamente.' });
            return;
        }

        res.json(SearchPermissionById);
    } catch (error) {
        res.status(404).json({ mensaje: "Error al buscar permiso, intente nuevamente." });
        return;
    }
}