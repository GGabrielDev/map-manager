import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '@/utils/auth-utils';

import { Request, Response } from 'express';
import { User, Role } from "@/models/";

// All Users
export const AllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const AllUsers = await User.findAll({});

        if (!AllUsers) {
            res.status(404).json({ mensaje: 'Error de consulta, intente nuevamente.' });
            return;
        }

        res.send(AllUsers);
    } catch (error) {
        res.status(404).json({ mensaje: "Error de consulta, intente nuevamente." });
    }
}

// Login User
type LoginUsersParams = { username: string; password: string};
export const LoginUsers = async (req: Request<LoginUsersParams>, res: Response): Promise<void> => {
    try {
        const { username, password } = req.params;
        
        const LoginUsers = await User.unscoped().findOne({
            where: { username }
        });

        if (!LoginUsers || !(await LoginUsers.validatePassword(password))) {
           throw new Error('Usuario o clave incorrecto.')
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: LoginUsers.id }, SECRET_KEY, {
            expiresIn: '1h',
        });

        res.json({ token });
    } catch (error) {
        res.status(404).json({ mensaje: "Error al buscar usuario, intente nuevamente." });
        return;
    }
}

// Get a Users By Id
type SearchUsersByIdParams = { id: number };
export const SearchUsersById = async (req: Request<SearchUsersByIdParams>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const SearchUsersById = await User.findOne({
            where: { id },
        });

        res.json(SearchUsersById);
    } catch (error) {
        res.status(404).json({ mensaje: "Error al buscar usuario, intente nuevamente." });
        return;
    }
}

type CreateUsersBody = { username: string; password: string; userId?: number[] };

export const CreateUsers = async (req: Request<{}, {}, CreateUsersBody>, res: Response): Promise<void> => {
    try {
        const { username, password, userId } = req.body;

        const ExistUser = await User.findOne({ where: { username } });
        if (ExistUser) {
            res.status(400).json({ mensaje: "El usuario ya existe." });
            return;
        }

        const CreateUsers = await User.create({
            username,
            passwordHash: password,
        });

        if (userId && userId.length > 0) {
            const roles = await Role.findAll({ where: { id: userId } });
            await CreateUsers.$set(User.RELATIONS.ROLES, roles);
        }

        res.send(CreateUsers);
    } catch (error) {
        res.status(404).json({ mensaje: "Error al registrar usuario, intente nuevamente." });
        return;
    }
}

type UpdateUsersParams = { id: number };
type UpdateUsersBody = {
    username?: string;
    passwordHash?: string;
    roleId?: number[];
};

export const UpdateUsers = async (
    req: Request<UpdateUsersParams, {}, UpdateUsersBody>,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const { username, passwordHash, roleId } = req.body;

        const UpdateUsers = await User.findByPk(id);
        if (!UpdateUsers) {
            res.status(404).json({ mensaje: "Usuario no encontrado" });
            return;
        }

        UpdateUsers.set(req.body);
        await UpdateUsers.save();

        if (roleId && roleId.length > 0) {
            const roles = await Role.findAll({ where: { id: roleId } });
            await UpdateUsers.$set(User.RELATIONS.ROLES, roles);
        }

        const UpdateUser = await User.findByPk(id, {
            include: [User.RELATIONS.ROLES],
        });

        res.json(UpdateUser);
    } catch (error) {
        res.status(404).json({ mensaje: "Error al actualizar usuario,intente nuevamente." });
    }
}

type DeleteUserParams = { id: number };

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
        res.status(404).json({ mensaje: "Error al eliminar usuario" });
    }
}