import { readFileSync } from "fs";
import { DOMParser } from "@xmldom/xmldom";
import * as tj from "@tmcw/togeojson";
import * as path from "path";

// Ruta del archivo KML (relativa a la ubicación de este script)
const kmlPath = path.resolve(__dirname, "../../../static/kml/archivoPrueba.kml");

function convertirKmlAGeoJson() {
  try {
    // Leer el archivo KML como texto
    const kmlTexto = readFileSync(kmlPath, "utf8");
    
    // Parsear el texto KML a un objeto DOM XML con xmldom
    const kmlDom = new DOMParser().parseFromString(kmlTexto);
    
    // Convertir el DOM KML a GeoJSON
    const geoJson = tj.kml(kmlDom);
    
    // Mostrar el objeto GeoJSON en consola
    console.log("GeoJSON resultante:", JSON.stringify(geoJson, null, 2));
    
    // Retornar el objeto GeoJSON si quieres usarlo luego
    return geoJson;
  } catch (error) {
    console.error("Error al convertir el archivo KML a GeoJSON:", error);
  }
}

convertirKmlAGeoJson();
