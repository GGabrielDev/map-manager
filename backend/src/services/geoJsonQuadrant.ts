import { readFileSync } from "fs";
import { DOMParser } from "@xmldom/xmldom";
import * as tj from "@tmcw/togeojson";
import * as path from "path";

// Importa tu conexión y modelo Sequelize
import { Quadrant } from "@/models/"; // Ajusta la ruta según tu proyecto

const kmlPath = path.resolve(__dirname, "../../../static/kml/Cuadrantes.kml");

// Función para eliminar dimensión Z de las coordenadas
function removeZFromCoordinates(coordinates: any): any {
  // La estructura para polígonos es un array de anillos (rings),
  // cada anillo es un array de puntos [X, Y, Z?].
  return coordinates.map((ring: any) =>
    ring.map((point: any) => point.slice(0, 2)) // conservar solo X, Y
  );
}

export default async function geoJsonQuadrants() {
  try {
    // Leer y convertir KML a GeoJSON
    const kmlTexto = readFileSync(kmlPath, "utf8");
    const kmlDom = new DOMParser().parseFromString(kmlTexto);
    const geoJson = tj.kml(kmlDom);

    if (!geoJson.features || !Array.isArray(geoJson.features)) {
      console.error("El GeoJSON no contiene features.");
      return;
    }

    for (const feature of geoJson.features) {
      const { geometry, properties } = feature;

      const name = properties.name;
      const boundary = geometry;

      // Eliminar dimensión Z si existe
      let boundaryWithoutZ = boundary;
      if (boundary && boundary.type === "Polygon" && Array.isArray(boundary.coordinates)) {
        boundaryWithoutZ = {
          ...boundary,
          coordinates: removeZFromCoordinates(boundary.coordinates),
        };
      }
      // Para otros tipos geométricos (MultiPolygon, etc.) podrías adaptar la función si las tienes

      try {
        // Optional: verificar si ya existe un cuadrante con ese nombre
        const existQuadrant = await Quadrant.findOne({ where: { name } });

        if (existQuadrant) {
          console.warn(`Cuadrante con nombre '${name}' ya existe. Se omite.`);
          continue;
        }

        // Insertar el nuevo cuadrante con la geometría sin Z
        await Quadrant.create({
          name,
          boundary: boundaryWithoutZ,
        });

        console.log(`Cuadrante '${name}' insertado correctamente.`);
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error guardando cuadrante '${name}':`, error.message);
        } else {
          console.error(`Error guardando cuadrante '${name}':`, error);
        }
      }
    }
  } catch (error) {
    console.error("Error al convertir y guardar cuadrantes:", error);
    throw error;
  }
}
