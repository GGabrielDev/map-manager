import jwt from 'jsonwebtoken';
import { Op, OrderItem } from 'sequelize';
import { SECRET_KEY } from '@/utils/auth-utils';
import { User, Role } from "@/models/";

// TODO: Check para Jhonattan para que revise el codigo de paginación y los cambios

interface PaginationOptions {
  page: number
  pageSize: number
}

export const SortByOptions = ['username', 'creationDate', 'updatedOn']
export const SortOrderOptions = ['ASC', 'DESC']

export interface UserFilterOptions extends PaginationOptions {
  username?: string
  sortBy?: (typeof SortByOptions)[number]
  sortOrder?: (typeof SortOrderOptions)[number]
}

interface PaginatedResult<T> {
  data: T[]
  total: number
  totalPages: number
  currentPage: number
}

// Login User
export const login = async (username: string, password: string): Promise<string> => {
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

// All Users
export const getAll = async ({
    page,
    pageSize,
    username,
    sortBy,
    sortOrder = 'ASC',
  }: UserFilterOptions): Promise<PaginatedResult<User>> => {
    if (page < 1 || pageSize < 1) {
      return { data: [], total: 0, totalPages: 0, currentPage: page }
    }

    const offset = (page - 1) * pageSize
    const andConditions: any[] = []

    // Filter by username (partial match)
    if (username) {
      andConditions.push({ username: { [Op.like]: `%${username}%` } })
    }

    const where = andConditions.length ? { [Op.and]: andConditions } : undefined

    let order: OrderItem[] | undefined = undefined
    if (sortBy) {
      const column =
        sortBy === 'creationDate'
          ? 'creationDate'
          : sortBy === 'updatedOn'
            ? 'updatedOn'
            : 'username'
      order = [[column, sortOrder]]
    }

    const data = await User.findAll({
      where,
      offset,
      limit: pageSize,
      order,
      include: [User.RELATIONS.ROLES],
    })

    const total = await User.count({ where })

    return {
      data,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
    }
  }
// Get a Users By Id
export const getById = async (id: number): Promise<User | null> => {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new Error('Invalid user id')
    }

    const user = await User.findByPk(id, {
      include: [
        {
          model: Role,
          as: User.RELATIONS.ROLES,
          include: [Role.RELATIONS.PERMISSIONS],
        },
      ],
    })

    if (!user) {
      return null
    }

    return user
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

export const updateUser = async (updates: Partial<User>, roleIds: Role['id'][] = []): Promise<User | null> => {
    try {
        const userToUpdate = await User.findByPk(updates.id);
        if (!userToUpdate) {
            throw new Error("Usuario no encontrado");
        }

        await userToUpdate.update(updates, { where: { id: updates.id } });

        if (roleIds && roleIds.length > 0) {
            const roles = await Role.findAll({ where: { id: roleIds } });
            await userToUpdate.$set(User.RELATIONS.ROLES, roles);
        }

        const updatedUser = await User.findByPk(updates.id, {
            include: [User.RELATIONS.ROLES],
        });

        return updatedUser;
    } catch (error) {
        throw new Error("Error al actualizar usuario, intente nuevamente.");
    }
}

export const deleteUser = async (id: number): Promise<boolean> => {
    try {
        const userToDelete = await User.findByPk(id);
        if (!userToDelete) {
            return false;
        }

        await User.destroy({
            where: { id },
        });

        return true;
    } catch (error) {
        throw new Error("Error al eliminar usuario, intente nuevamente.");
    }
}
