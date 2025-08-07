import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '@/utils/auth-utils';
import { User, Role } from "@/models/";

// All Users
export const AllUsers = async (): Promise<User[]> => {
    try {
        const AllUsers = await User.findAll({});

        if (!AllUsers) {
            throw new Error ('Error de consulta, intente nuevamente.');
        }

        return AllUsers;
    } catch (error) {
        throw new Error("Error de consulta, intente nuevamente.");
    }
}

// Login User
export const LoginUser = async (username: string, password: string): Promise<string> => {
    try {
        const LoginUser = await User.unscoped().findOne({
            where: { username }
        });

        if (!LoginUser || !(await LoginUser.validatePassword(password))) {
           throw new Error('Usuario o clave incorrecto.')
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: LoginUser.id }, SECRET_KEY, {
            expiresIn: '1h',
        });

        return token;
    } catch (error) {
        throw new Error("Error al buscar usuario, intente nuevamente.");
    }
}

// Get a Users By Id
export const SearchUserById = async (id: number): Promise<User | null> => {
    try {
        const SearchUserById = await User.findOne({
            where: { id },
        });

        return SearchUserById;
    } catch (error) {
        return null;
    }
}

export const CreateUser = async (username: string, password: string, roleIds: number[]): Promise<User> => {
    try {
        const ExistUser = await User.findOne({ where: { username } });
        if (ExistUser) {
            throw new Error("El usuario ya existe.");
        }

        const UserCreate = await User.create({
            username,
            passwordHash: password,
        });

        if (roleIds && roleIds.length > 0) {
            const roles = await Role.findAll({ where: { id: roleIds } });
            await UserCreate.$set(User.RELATIONS.ROLES, roles);
        }

        return UserCreate;
    } catch (error) {
        throw new Error("Error al registrar usuario, intente nuevamente.");
    }
}

export const UpdateUser = async (Updates: Partial<User>, roleIds: Role['id'][] = []): Promise<User | null> => {
    try {
        const UpdateUsers = await User.findByPk(Updates.id);
        if (!UpdateUsers) {
            throw new Error("Usuario no encontrado");
        }

        await UpdateUsers.update(Updates);

        if (roleIds && roleIds.length > 0) {
            const roles = await Role.findAll({ where: { id: roleIds } });
            await UpdateUsers.$set(User.RELATIONS.ROLES, roles);
        }

        const UpdateUser = await User.findByPk(Updates.id, {
            include: [User.RELATIONS.ROLES],
        });

        return UpdateUser;
    } catch (error) {
        throw new Error("Error al actualizar usuario, intente nuevamente.");
    }
}

export const DeleteUser = async (id: number): Promise<void> => {
    try {
                await User.destroy({
            where: { id },
        });

        return;
    } catch (error) {
        throw new Error("Error al eliminar usuario, intente nuevamente.");
    }
}