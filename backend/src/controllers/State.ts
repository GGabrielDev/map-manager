import { State, Municipality } from "@/models";

// All States
export const allStates = async (): Promise<State[]> => {
    try {
        const allStates = await State.findAll({});

        if (!allStates) {
            throw new Error("No se encontraron estados.");
        }

        return allStates;
    } catch (error) {
        throw new Error("Error al obtener los estados, intente nuevamente.");
    }
}

// Get State by ID
export const getStateById = async (id: number): Promise<State | null> => {
    try {
        const state = await State.findOne({
            where: { id },
            include: [Municipality]
        });

        if (!state) {
            throw new Error("Estado no encontrado.");
        }

        return state;
    } catch (error) {
        throw new Error("Error al obtener el estado, intente nuevamente.");
    }
}

// Create State
export const createState = async (name:string): Promise<State> => {
    try {
        const existState = await State.findOne({ where: { name } });

        if (existState) {
            throw new Error("El estado ya existe.");
        }

        const createState = await State.create({
            name,
        })

        return createState;

    } catch (error) {
        throw new Error("Error al crear el estado, intente nuevamente.");
    }
}

// Update State
export const updateState = async (updates: Partial<State>): Promise<State | null> => {
    try {
        const updateToState = await State.findOne({ where: { id: updates.id } });

        if (!updateToState) {
            throw new Error("Estado no encontrado.");
        }

        await updateToState.update(updates);

        return updateToState;
    } catch (error) {
        throw new Error("Error al actualizar el estado, intente nuevamente.");
    }
}

//Delete States
export const deleteState = async (id: number): Promise<boolean> => {
    try {
        const state = await State.findOne({ where: { id } });

        if (!state) {
            return false;
        }

        const countMunicipalities = await Municipality.count({ where: { stateId: id } });
        if (countMunicipalities > 0) {
            throw new Error("No se puede eliminar el estado, ya que tiene municipios asociados.");
        }

        await state.destroy();
        return true;
    } catch (error) {
        throw new Error("Error al eliminar el estado, intente nuevamente.");
    }
}