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

type CrearUsuarioBody = { nombre: string; contrasena: string; idRol: number };

export const crearUsuario = async (req: Request<{}, {}, CrearUsuarioBody>, res: Response): Promise<void> => {
    try {
        const { nombre, contrasena} = req.body;
        let { idRol } = req.body;

        const existeUsuario = await usuario.findOne({ where: { nombre } });
        if (existeUsuario) {
            res.status(400).json({ mensaje: "El usuario ya existe." });
            ;
        }

        if (idRol === undefined || idRol === null) idRol = 3
        const rolExistente = await rol.findByPk(idRol);
        if (!rolExistente) {
            res.status(400).json({ mensaje: "rol ingresado inexistente." });
            ;
        }

        const saltRounds = 10;
        const contrasenaHasheada = await bcrypt.hash(contrasena, saltRounds);

        const crearUsuarios = await usuario.create({
            nombre,
            contrasena: contrasenaHasheada,
            idRol
        });

        res.send(crearUsuarios);
    } catch (error) {
        res.status(404).json({ mensaje: "Error al registrar usuario, intente nuevamente." });
    }
}

type ActualizarUsuarioParams = { id: string };
type ActualizarUsuarioBody = {
    nombre?: string;
    contrasena?: string;
    idRol?: number;
};

export const actualizarUsuario = async (
    req: Request<ActualizarUsuarioParams, {}, ActualizarUsuarioBody>,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const { nombre, contrasena, idRol } = req.body;

        const actualizarUsuarios = await usuario.findByPk(id);
        if (!actualizarUsuarios) {
            res.status(404).json({ mensaje: "Usuario no encontrado" });
            return;
        }

        if (idRol) {
            const rolExistente = await rol.findByPk(idRol);
            if (!rolExistente) {
                res.status(400).json({ mensaje: "rol inexistente" });
                return;
            }
        }

        if(contrasena){
            const saltRounds = 10;
            const contrasenaNueva = await bcrypt.hash(contrasena, saltRounds);
            req.body.contrasena = contrasenaNueva
        } else {
            delete req.body.contrasena;
        }
        

        actualizarUsuarios.set(req.body);
        await actualizarUsuarios.save();

        res.json(actualizarUsuarios);
    } catch (error) {
        res.status(404).json({ mensaje: "Error al actualizar usuario,intente nuevamente." });
    }
}

type EliminarUsuarioParams = { id: string };

export const eliminarUsuario = async (
    req: Request<EliminarUsuarioParams>,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        await usuario.destroy({
            where: { id },
        });

        res.sendStatus(200);
    } catch (error) {
        res.status(404).json({ mensaje: "error al eliminar usuario" });
    }
}
