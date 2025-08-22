import sequelize from '@/loaders/sequelize'
import geoJsonQuadrants from '@/services/geoJsonQuadrant'

async function run() {
  try {
    await sequelize.authenticate() // Ensure the connection is established
    await sequelize.sync() // Ensure the models are synchronized with the database

    await geoJsonQuadrants()
    console.log('Cuadrantes poblados exitosamente.')
  } catch (error) {
    console.error('Error populando cuadrantes:', error)
  }
}

run()