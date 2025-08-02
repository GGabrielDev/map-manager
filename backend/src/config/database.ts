import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';

dotenv.config();

const {
  DB_DIALECT,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_STORAGE,
  NODE_ENV
} = process.env;

let sequelize: Sequelize;

if (DB_DIALECT === 'sqlite' || NODE_ENV === 'test') {
  // SQLite configuration for testing
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: DB_STORAGE || ':memory:',
    logging: NODE_ENV === 'development' ? console.log : false,
    models: [__dirname + '/../models/**/*.ts'],
    modelMatch: (filename, member) => {
      return filename.substring(0, filename.indexOf('.model')) === member.toLowerCase();
    },
  });
} else {
  // PostgreSQL configuration for production
  sequelize = new Sequelize({
    dialect: 'postgres',
    host: DB_HOST || 'localhost',
    port: parseInt(DB_PORT || '5432'),
    database: DB_NAME || 'geospatial_admin',
    username: DB_USER,
    password: DB_PASSWORD,
    logging: NODE_ENV === 'development' ? console.log : false,
    models: [__dirname + '/../models/**/*.ts'],
    modelMatch: (filename, member) => {
      return filename.substring(0, filename.indexOf('.model')) === member.toLowerCase();
    },
    define: {
      timestamps: true,
      underscored: false,
      paranoid: true, // Enable soft deletes
      deletedAt: 'deletionDate',
      createdAt: 'creationDate',
      updatedAt: 'updatedOn',
    },
  });
}

export default sequelize;

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    if (NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('📊 Database synchronized.');
    }
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

export const closeDatabase = async (): Promise<void> => {
  try {
    await sequelize.close();
    console.log('🔌 Database connection closed.');
  } catch (error) {
    console.error('❌ Error closing database connection:', error);
  }
};
