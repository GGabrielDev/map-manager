import { Request, Response } from 'express';
import { User, Role } from "@/models/";
import bcrypt from "bcrypt";

export const AllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const AllUsers = await User.findAll({
            include: [{
                model: Role,
                attributes: ['name']
            }]
        });

        if (!AllUsers) {
            res.status(404).json({ mensaje: 'Error de consulta, intente nuevamente.' });
            return;
        }

        res.send(AllUsers);
    } catch (error) {
        res.status(404).json({ mensaje: "Error de consulta, intente nuevamente." });
    }
}

type SearchUsersParams = { username: string; password: string };

export const SearchUsers = async (req: Request<SearchUsersParams>, res: Response): Promise<void> => {
    try {
        const { username, password } = req.params;

        if (!username || !password) {
            res.status(400).json({ mensaje: 'Faltan parámetros requeridos' });
            return;
        }

        const SearchUsers = await User.findOne({
            where: { username },
            include: [{
                model: Role,
                attributes: ['name']
            }]
        });

        if (!SearchUsers) {
            res.status(401).json({ mensaje: 'Error al buscar usuario, intente nuevamente.' });
            return;
        }

        const passwordHash = (SearchUsers.get() as { password: string }).password;
        const passwordValid = await bcrypt.compare(password, passwordHash);

        if (!passwordValid) {
            res.status(401).json({ mensaje: 'Datos incorrectos' });
            return;
        }

        res.json(SearchUsers);
    } catch (error) {
        res.status(404).json({ mensaje: "Error al buscar usuario, intente nuevamente." });
        return;
    }
}

type SearchUsersByIdParams = { id: string };

export const SearchUsersById = async (req: Request<SearchUsersByIdParams>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const SearchUsersById = await User.findOne({
            where: { id },
            include: [{
                model: Role,
                attributes: ['name']
            }]
        });

        if (!SearchUsersById) {
            res.status(404).json({ mensaje: 'Error al buscar usuario, intente nuevamente.' });
            return;
        }

        res.json(SearchUsersById);
    } catch (error) {
        res.status(404).json({ mensaje: "Error al buscar usuario, intente nuevamente." });
        return;
    }
}

type CreateUsersBody = { username: string; password: string;};

export const CreateUsers = async (req: Request<{}, {}, CreateUsersBody>, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        const ExistUser = await User.findOne({ where: { name } });
        if (ExistUser) {
            res.status(400).json({ mensaje: "El usuario ya existe." });
            return;
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const CreateUsers = await User.create({
            username,
            passwordHash,
        });

        res.send(CreateUsers);
    } catch (error) {
        res.status(404).json({ mensaje: "Error al registrar usuario, intente nuevamente." });
        return;
    }
}

type UpdateUsersParams = { id: string };
type UpdateUsersBody = {
    username?: string;
    password?: string;
    passwordHash?: string;
};

export const UpdateUsers = async (
    req: Request<UpdateUsersParams, {}, UpdateUsersBody>,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const { username, passwordHash, password } = req.body;

        const UpdateUsers = await User.findByPk(id);
        if (!UpdateUsers) {
            res.status(404).json({ mensaje: "Usuario no encontrado" });
            return;
        }

       if(password){
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);
            req.body.password = passwordHash
        } else {
            delete req.body.password;
        }
        

        UpdateUsers.set(req.body);
        await UpdateUsers.save();

        res.json(UpdateUsers);
    } catch (error) {
        res.status(404).json({ mensaje: "Error al actualizar usuario,intente nuevamente." });
    }
}

type DeleteUserParams = { id: string };

export const DeleteUser = async (
    req: Request<DeleteUserParams>,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        await User.destroy({
            where: { id },
        });

        res.sendStatus(200);
    } catch (error) {
        res.status(404).json({ mensaje: "error al eliminar usuario" });
    }
}
