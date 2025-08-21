import { PointOfInterest, Responsible, Organism, CommunalCircuit, Quadrant } from "@/models/";
import { Op, OrderItem, Sequelize } from "sequelize";

interface PaginationOptions {
  page: number;
  pageSize: number;
}

export const SortByOptions = ['name', 'creationDate', 'updatedOn']
export const SortOrderOptions = ['ASC', 'DESC'] as const;

export interface PointOfInterestFilterOptions extends PaginationOptions {
  name?: string;
  sortBy?: (typeof SortByOptions)[number];
  sortOrder?: (typeof SortOrderOptions)[number];
}

interface PaginatedResult<T> {
  data: T[];
  total: number;
  totalPage: number;
  currentPage: number;
}

// Obtener todos los puntos de interés con paginación y filtros
export const allPointsOfInterest = async ({
  page,
  pageSize,
  name,
  sortBy,
  sortOrder = 'ASC',
}: PointOfInterestFilterOptions): Promise<PaginatedResult<PointOfInterest>> => {
  try {
    if (page < 1 || pageSize < 1) {
      return { data: [], total: 0, totalPage: 0, currentPage: page };
    }

    const offset = (page - 1) * pageSize;
    const andConditions: any[] = [];

    if (name) {
      // Filtro por nombre
      andConditions.push({ name: { [Op.iLike]: `%${name}%` } });
    }

    const where = andConditions.length ? { [Op.and]: andConditions } : undefined;

    let order: OrderItem[] | undefined = undefined;
    if (sortBy) {
      const column =
        sortBy === 'creationDate'
          ? 'creationDate'
          : sortBy === 'updatedOn'
          ? 'updatedOn'
          : 'name';
      order = [[column, sortOrder]];
    }

    const data = await PointOfInterest.findAll({
      where,
      offset,
      limit: pageSize,
      order,
      include: [
        { association: 'responsible', required: false },
        { association: 'organism', required: false },
        { association: 'communalCircuit', required: false },
        { association: 'quadrant', required: false }
      ],
      // Convertir geometry a GeoJSON
      attributes: {
        include: [[Sequelize.literal(`ST_AsGeoJSON("geometry")::json`), 'geometry']]
      }
    });

    const total = await PointOfInterest.count({ where });

    return {
      data,
      total,
      totalPage: Math.ceil(total / pageSize),
      currentPage: page,
    };
  } catch (error) {
    throw new Error("Error al obtener los puntos de interés, intente nuevamente.");
  }
};

// todos los puntos de interes pero con respuesta geojson
export const allPointsOfInterestGeoJSON = async ({
  name,
  communalCircuitId,
  quadrantId,
  bbox, // bounding box: [minLng, minLat, maxLng, maxLat]
  sortBy,
  sortOrder = 'ASC'
}: {
  name?: string;
  communalCircuitId?: number;
  quadrantId?: number;
  bbox?: [number, number, number, number];
  sortBy?: 'name' | 'creationDate' | 'updatedOn';
  sortOrder?: 'ASC' | 'DESC';
}) => {
  try {
    const andConditions: any[] = [];

    if (name) {
      andConditions.push({ name: { [Op.iLike]: `%${name}%` } });
    }

    if (communalCircuitId) {
      andConditions.push({ communalCircuitId });
    }

    if (quadrantId) {
      andConditions.push({ quadrantId });
    }

    // Condición para bbox (bounding box) usando PostGIS ST_MakeEnvelope
    if (bbox && bbox.length === 4) {
      const [minLng, minLat, maxLng, maxLat] = bbox;

      // Sequelize.literal para filtro espacial con ST_Within y ST_MakeEnvelope
      andConditions.push(
        Sequelize.literal(`ST_Within(geometry, ST_MakeEnvelope(${minLng}, ${minLat}, ${maxLng}, ${maxLat}, 4326))`)
      );
    }

    const where = andConditions.length ? { [Op.and]: andConditions } : undefined;

    let order: OrderItem[] | undefined = undefined;
    if (sortBy) {
      const column =
        sortBy === 'creationDate' ? 'creationDate' :
        sortBy === 'updatedOn' ? 'updatedOn' :
        'name';
      order = [[column, sortOrder]];
    }

    const data = await PointOfInterest.findAll({
      where,
      order,
      include: [
        { association: 'responsible', required: false },
        { association: 'organism', required: false },
        { association: 'communalCircuit', required: false },
        { association: 'quadrant', required: false },
      ],
      attributes: {
        include: [[Sequelize.literal(`ST_AsGeoJSON("geometry")::json`), 'geometry']]
      }
    });

    const features = data.map(point => ({
      type: "Feature",
      geometry: point.get('geometry'),
      properties: {
        id: point.id,
        name: point.name,
        description: point.description,
        responsibleId: point.responsibleId,
        organismId: point.organismId,
        communalCircuitId: point.communalCircuitId,
        quadrantId: point.quadrantId,
        creationDate: point.creationDate,
        updatedOn: point.updatedOn,
        deletionDate: point.deletionDate,
        responsible: point.responsible,
        organism: point.organism,
        communalCircuit: point.communalCircuit,
        quadrant: point.quadrant,
      }
    }));

    return {
      type: "FeatureCollection",
      features
    };
  } catch (error) {
    throw new Error("Error al obtener los puntos de interés en formato GeoJSON.");
  }
};

// Obtener punto de interés por ID
export const getPointOfInterestById = async (id: number): Promise<PointOfInterest | null> => {
  try {
    const point = await PointOfInterest.findOne({
      where: { id },
      include: [
        { association: 'responsible', required: false },
        { association: 'organism', required: false },
        { association: 'communalCircuit', required: false },
        { association: 'quadrant', required: false }
      ],
      attributes: {
        include: [[Sequelize.literal(`ST_AsGeoJSON("geometry")::json`), 'geometry']]
      }
    });

    if (!point) {
      throw new Error("Punto de interés no encontrado");
    }

    return point;
  } catch (error) {
    throw new Error("Error al obtener el punto de interés, intente nuevamente.");
  }
};

export const createPointOfInterest = async (
  name: string,
  geometry: object, // Validar que tenga formato GeoJSON Point
  description?: string,
  responsibleId?: number,
  organismId?: number,
  communalCircuitId?: number,
  quadrantId?: number,
): Promise<PointOfInterest> => {
  try {
    // Validar campos obligatorios
    if (!responsibleId) {
      throw new Error("El responsable es obligatorio.");
    }
    if (!organismId) {
      throw new Error("El organismo es obligatorio.");
    }

    const newPoint = await PointOfInterest.create({
      name,
      description,
      geometry,
      responsibleId,
      organismId,
      communalCircuitId,
      quadrantId,
    });

    return newPoint;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al crear el punto de interés: ${error.message}`);
    }else{
      throw new Error("Error al crear el punto de interés, intente nuevamente.");
    }
  }
};

//obtener el punto de interés por ID como un geojson
export const getPointOfInterestGeoJSONById = async (id: number) => {
  try {
    const point = await PointOfInterest.findOne({
      where: { id },
      include: [
        { association: 'responsible', required: false },
        { association: 'organism', required: false },
        { association: 'communalCircuit', required: false },
        { association: 'quadrant', required: false },
      ],
      attributes: {
        include: [[Sequelize.literal(`ST_AsGeoJSON("geometry")::json`), 'geometry']]
      }
    });

    if (!point) {
      throw new Error("Punto de interés no encontrado");
    }

    return {
      type: "Feature",
      geometry: point.get('geometry'),
      properties: {
        id: point.id,
        name: point.name,
        description: point.description,
        responsibleId: point.responsibleId,
        organismId: point.organismId,
        communalCircuitId: point.communalCircuitId,
        quadrantId: point.quadrantId,
        creationDate: point.creationDate,
        updatedOn: point.updatedOn,
        deletionDate: point.deletionDate,
        responsible: point.responsible,
        organism: point.organism,
        communalCircuit: point.communalCircuit,
        quadrant: point.quadrant,
      }
    };
  } catch (error) {
    throw new Error("Error al obtener el punto de interés en formato GeoJSON.");
  }
};


// Actualizar punto de interés
export const updatePointOfInterest = async (updates: Partial<PointOfInterest>): Promise<PointOfInterest | null> => {
  try {
    if (updates.responsibleId) {
      const responsible = await Responsible.findOne({ where: { id: updates.responsibleId } });
      if (!responsible) {
        throw new Error("El responsable no existe");
      }
    }
    
    if (updates.organismId) {
      const organism = await Organism.findOne({ where: { id: updates.organismId } });
      if (!organism) {
        throw new Error("El organismo no existe");
      }
    }

    if (updates.communalCircuitId) {
      const communalCircuit = await CommunalCircuit.findOne({ where: { id: updates.communalCircuitId } });
      if (!communalCircuit) {
        throw new Error("El circuito comunal no existe");
      }
    }

    if (updates.quadrantId) {
      const quadrant = await Quadrant.findOne({ where: { id: updates.quadrantId } });
      if (!quadrant) {
        throw new Error("El cuadrante no existe");
      }
    }

    const point = await PointOfInterest.findOne({ where: { id: updates.id } });
    if (!point) {
      throw new Error("Punto de interés no encontrado");
    }


    await point.update(updates);

    return point;
  } catch (error) {
    throw new Error("Error al actualizar el punto de interés");
  }
};

// Eliminar punto de interés (soft delete con Sequelize "paranoid")
export const deletePointOfInterest = async (id: number): Promise<boolean> => {
  try {
    const point = await PointOfInterest.findOne({ where: { id } });
    if (!point) {
      return false;
    }

    await point.destroy();
    return true;
  } catch (error) {
    throw new Error("Error al eliminar el punto de interés");
  }
};
