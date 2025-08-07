import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '@/utils/auth-utils';
import { User, Role } from "@/models/";

// All Users
export const allUsers = async (): Promise<User[]> => {
    try {
        const allUsers = await User.findAll({});

        if (!allUsers) {
            throw new Error ('Error de consulta, intente nuevamente.');
        }

        return allUsers;
    } catch (error) {
        throw new Error("Error de consulta, intente nuevamente.");
    }
}

// Login User
export const loginUser = async (username: string, password: string): Promise<string> => {
    try {
        const loginUser = await User.unscoped().findOne({
            where: { username }
        });

        if (!loginUser || !(await loginUser.validatePassword(password))) {
           throw new Error('Usuario o clave incorrecto.')
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: loginUser.id }, SECRET_KEY, {
            expiresIn: '1h',
        });

        return token;
    } catch (error) {
        throw new Error("Error al buscar usuario, intente nuevamente.");
    }
}

// Get a Users By Id
export const searchUserById = async (id: number): Promise<User | null> => {
    try {
        const searchUserById = await User.findOne({
            where: { id },
        });

        return searchUserById;
    } catch (error) {
        return null;
    }
}

export const createUser = async (username: string, password: string, roleIds: number[]): Promise<User> => {
    try {
        const existUser = await User.findOne({ where: { username } });
        if (existUser) {
            throw new Error("El usuario ya existe.");
        }

        const userCreate = await User.create({
            username,
            passwordHash: password,
        });

        if (roleIds && roleIds.length > 0) {
            const roles = await Role.findAll({ where: { id: roleIds } });
            await userCreate.$set(User.RELATIONS.ROLES, roles);
        }

        return userCreate;
    } catch (error) {
        throw new Error("Error al registrar usuario, intente nuevamente.");
    }
}

export const updateUser = async (Updates: Partial<User>, roleIds: Role['id'][] = []): Promise<User | null> => {
    try {
        const userToUpdate = await User.findByPk(Updates.id);
        if (!userToUpdate) {
            throw new Error("Usuario no encontrado");
        }

        await userToUpdate.update(Updates, { where: { id: Updates.id } });

        if (roleIds && roleIds.length > 0) {
            const roles = await Role.findAll({ where: { id: roleIds } });
            await userToUpdate.$set(User.RELATIONS.ROLES, roles);
        }

        const updateUser = await User.findByPk(Updates.id, {
            include: [User.RELATIONS.ROLES],
        });

        return updateUser;
    } catch (error) {
        throw new Error("Error al actualizar usuario, intente nuevamente.");
    }
}

export const deleteUser = async (id: number): Promise<void> => {
    try {
                await User.destroy({
            where: { id },
        });

        return;
    } catch (error) {
        throw new Error("Error al eliminar usuario, intente nuevamente.");
    }
}