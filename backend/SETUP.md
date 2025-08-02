# Backend Setup Instructions

## Prerequisites

Before setting up the backend, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **Yarn** package manager
- **PostgreSQL** (for production) or **SQLite** (for testing)

## Installation Steps

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file with your database credentials and other configuration:

   ```env
   # Database Configuration
   DB_DIALECT=postgres
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=geospatial_admin
   DB_USER=your_username
   DB_PASSWORD=your_password

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE_TIME=1h

   # Server Configuration
   PORT=4000
   BASE_URL=localhost
   CORS_ORIGIN=http://localhost:3000

   # Environment
   NODE_ENV=development
   ```

4. **Set up your database:**
   - For PostgreSQL: Create a database named `geospatial_admin`
   - For SQLite: No setup needed (will be created automatically)

5. **Start the development server:**
   ```bash
   yarn dev
   ```

The server will start at `http://localhost:4000` (or your configured PORT).

## Available Scripts

- `yarn dev` - Start development server with hot reload
- `yarn start` - Start production server
- `yarn build` - Build the project for production
- `yarn lint` - Run ESLint with auto-fix
- `yarn lint:check` - Run ESLint without auto-fix

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   └── index.ts         # Application entry point
├── dist/                # Compiled JavaScript (generated)
├── .env.example         # Environment variables template
├── .gitignore           # Git ignore rules
├── .prettierrc          # Prettier configuration
├── eslint.config.js     # ESLint configuration
├── jest.config.js       # Jest testing configuration
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md            # Project documentation
```

## Development Workflow

1. **Code Quality:**
   - TypeScript for type safety
   - ESLint for code linting
   - Prettier for code formatting
   - Path aliases (`@/`) for clean imports

2. **Database:**
   - Sequelize ORM with TypeScript support
   - PostgreSQL for production
   - SQLite for testing
   - Automatic migrations and seeding

## Next Steps

After completing the setup:

1. Install dependencies: `yarn install`
2. Set up your database and environment variables
3. Start implementing the database models in `src/models/`
4. Create API routes in `src/routes/`
5. Implement business logic in `src/services/`

## Troubleshooting

- **TypeScript errors:** Run `yarn install` to install all dependencies
- **Database connection issues:** Check your `.env` file configuration
- **Port already in use:** Change the PORT in your `.env` file
- **Import path issues:** Ensure you're using the `@/` alias for internal imports
