import { Municipality, State, Parish } from "@/models";

// All Municipalities
export const allMunicipalities = async (): Promise<Municipality[]> => {
    try {
        const allMunicipalities = await Municipality.findAll({});

        if (!allMunicipalities) {
            throw new Error("No se encontraron municipios.");
        }

        return allMunicipalities;
    } catch (error) {
        throw new Error("Error al obtener los municipios, intente nuevamente.");
    }
}

// Get Municipality by ID
export const searchMunicipalityById = async (id: number): Promise<Municipality | null> => {
    try {
        const municipality = await Municipality.findOne({
            where: { id },
        });

        if (!municipality) {
            throw new Error("Municipio no encontrado.");
        }

        return municipality;
    } catch (error) {
        throw new Error("Error al obtener el municipio, intente nuevamente.");
    }
}

// Create Municipality
export const createMunicipality = async (data: Partial<Municipality>): Promise<Municipality> => {
    try {
        const existMunicipality = await Municipality.findOne({ where: { name: data.name, stateId: data.stateId } });

        if (existMunicipality) {
            throw new Error("El municipio ya existe.");
        }

        const createMunicipality = await Municipality.create(data);

        return createMunicipality;

    } catch (error) {
        throw new Error("Error al crear el municipio, intente nuevamente.");
    }
}

// Update Municipality
export const updateMunicipality = async (updates: Partial<Municipality>): Promise<Municipality | null> => {
    try {
        const updateToMunicipality = await Municipality.findOne({ where: { id: updates.id } });

        if (!updateToMunicipality) {
            throw new Error("Municipio no encontrado.");
        }

        await updateToMunicipality.update(updates);

        return updateToMunicipality;
    } catch (error) {
        throw new Error("Error al actualizar el municipio, intente nuevamente.");
    }
}

// Delete Municipality
export const deleteMunicipality = async (id: number): Promise<boolean> => {
    try {
        const municipality = await Municipality.findOne({ where: { id } });

        if (!municipality) {
            return false;
        }

        const countParish = await Parish.count({ where: { municipalityId: id } });
        if (countParish > 0) {
            throw new Error("No se puede eliminar el municipio, ya que tiene parroquias asociadas.");
        }

        await municipality.destroy();
        return true;
    } catch (error) {
        throw new Error("Error al eliminar el municipio, intente nuevamente.");
    }
}