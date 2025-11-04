# Gym Icesi Backend

This is the backend for the Gym Icesi project, built with Node.js, Express, PostgreSQL (Sequelize), and MongoDB (Mongoose).

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [API Documentation (Swagger)](#api-documentation-swagger)
- [Database Schema](#database-schema)
  - [PostgreSQL](#postgresql)
  - [MongoDB](#mongodb)
- [API Endpoints](#api-endpoints)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication and authorization (JWT)
- CRUD operations for users, trainers, routines, and progress
- Statistics and reports
- Modular and clean code structure
- Data validation
- Global error handling
- Request logging
- API documentation with Swagger
- Environment variable management

## Technologies

- Node.js
- Express.js
- PostgreSQL (Sequelize)
- MongoDB (Mongoose)
- JSON Web Tokens (JWT)
- Express Validator
- Swagger UI Express & Swagger JSDoc
- Morgan (for logging)
- Dotenv
- Helmet & CORS
- ESLint & Prettier

## Project Structure

```
gym-icesi-backend/
├── src/
│   ├── app.js
│   ├── config/
│   │   ├── db.postgres.js
│   │   ├── db.mongo.js
│   │   └── swagger.js
│   ├── models/
│   │   ├── postgres/
│   │   │   ├── User.js
│   │   │   ├── Trainer.js
│   │   │   ├── Routine.js
│   │   │   ├── Progress.js
│   │   │   ├── StatisticsUser.js
│   │   │   └── StatisticsTrainer.js
│   │   └── mongo/
│   │       ├── Exercise.js
│   │       ├── PredefinedRoutine.js
│   │       ├── Recommendation.js
│   │       └── Event.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── trainer.routes.js
│   │   ├── routine.routes.js
│   │   ├── progress.routes.js
│   │   ├── statistics.routes.js
│   │   └── report.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── trainer.controller.js
│   │   ├── routine.controller.js
│   │   ├── progress.controller.js
│   │   ├── statistics.controller.js
│   │   └── report.controller.js
│   ├── services/
│   ├── middlewares/
│   │   ├── auth.js
│   │   ├── authorize.js
│   │   ├── error.js
│   │   └── validation/
│   │       ├── auth.validation.js
│   │       ├── user.validation.js
│   │       ├── trainer.validation.js
│   │       └── routine.validation.js
│   ├── utils/
│   └── tests/
├── package.json
├── server.js
├── .env
├── .env.example
├── .eslintrc.json
└── .prettierrc.json
```

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- npm (comes with Node.js)
- PostgreSQL
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd gym-icesi-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root directory of the project and add the following environment variables. You can use `.env.example` as a template.

```
PORT=3000
NODE_ENV=development

# PostgreSQL
PG_HOST=localhost
PG_USER=postgres
PG_PASSWORD=password
PG_DB=gym_icesi_db
PG_PORT=5432

# MongoDB
MONGO_URI=mongodb://localhost:27017/gym_icesi_db

# JWT
JWT_SECRET=supersecretjwtkey
JWT_EXPIRES_IN=1h
```

### Running the Application

To start the application in development mode (with `nodemon` for auto-restarts):

```bash
npm run dev
```

To start the application in production mode:

```bash
npm start
```

The API will be available at `http://localhost:3000` (or your specified PORT).

## API Documentation (Swagger)

Once the application is running, you can access the API documentation at:

`http://localhost:3000/api-docs`

## Database Schema

### PostgreSQL

- **users**: `id`, `name`, `email`, `password`, `role`, `department`, `program`, `createdAt`, `updatedAt`
- **trainers**: `id`, `name`, `specialization`, `createdAt`, `updatedAt`
- **routines**: `id`, `user_id` (FK to users), `name`, `created_at`
- **progress**: `id`, `routine_id` (FK to routines), `date`, `reps`, `time`, `effort`
- **statistics_users**: `user_id` (FK to users), `month`, `routines_started`, `followups`
- **statistics_trainers**: `trainer_id` (FK to trainers), `month`, `new_assignments`, `followups`

### MongoDB

- **exercises**: `{ name, type, description, duration, difficulty, video_url }`
- **predefined_routines**: `{ name, exercises: [ids], difficulty, description }`
- **recommendations**: `{ user_id, trainer_id, message, date }`
- **events**: `{ title, date, description }`

## API Endpoints

### Auth
- `POST /auth/login` — login con correo institucional y JWT.
- `POST /auth/register` — crear usuario.

### Users
- `GET /users`
- `GET /users/:id`
- `POST /users`
- `PUT /users/:id`
- `DELETE /users/:id`

### Trainers
- `GET /trainers`
- `POST /trainers`
- `PUT /trainers/:id`
- `DELETE /trainers/:id`
- `GET /trainers/:id/users` — ver usuarios asignados.

### Routines
- `GET /routines`
- `POST /routines`
- `PUT /routines/:id`
- `DELETE /routines/:id`
- `POST /routines/:id/progress` — registrar progreso.

### Progress
- `GET /progress/user/:id`
- `GET /progress/routine/:id`

### Statistics
- `GET /statistics/users/:month`
- `GET /statistics/trainers/:month`

### Reports
- `GET /reports/top-users`
- `GET /reports/trainer-performance`

## Scripts

- `npm start`: Starts the application in production mode.
- `npm run dev`: Starts the application in development mode with `nodemon`.
- `npm run lint`: Lints all JavaScript files in the `src` directory.
- `npm run lint:fix`: Lints and fixes all fixable JavaScript files in the `src` directory.
- `npm run format`: Formats all JavaScript files in the `src` directory using Prettier.

## Deployment

This project can be deployed to platforms like Render or Railway.

### Deploying to Render

1.  **Prepare your Databases:**
    *   **PostgreSQL:** Create a PostgreSQL database instance (e.g., using Render's managed PostgreSQL, ElephantSQL, or another provider). Note down the connection string (host, user, password, database, port).
    *   **MongoDB:** Create a MongoDB database instance (e.g., using MongoDB Atlas or Render's managed MongoDB). Note down the connection URI.

2.  **Create a new Web Service on Render:**
    *   Go to your Render dashboard and create a new `Web Service`.
    *   Connect your GitHub repository containing the `gym-icesi-backend` project.
    *   **Root Directory:** Ensure this is set to the root of your backend project (e.g., `/`).
    *   **Runtime:** Node.js
    *   **Build Command:** `npm install`
    *   **Start Command:** `npm start`

3.  **Configure Environment Variables:**
    *   In your Render service settings, go to `Environment` and add all the variables from your local `.env` file.
    *   **Crucially, update the database connection details:**
        *   `PG_HOST`, `PG_USER`, `PG_PASSWORD`, `PG_DB`, `PG_PORT`: Use the credentials from your deployed PostgreSQL instance.
        *   `MONGO_URI`: Use the connection URI from your deployed MongoDB instance.
    *   `JWT_SECRET`: Keep this a strong, secret value.
    *   `NODE_ENV`: Set to `production`.
    *   `PORT`: Render automatically sets this, so you might not need to explicitly define it unless your app expects a specific one.

4.  **CORS Configuration:**
    *   Once your frontend is deployed, you will need its URL. Add this URL to your backend's CORS configuration. In `src/app.js`, the `cors()` middleware is used. You might need to configure it to allow requests from your frontend's domain. For example:
        ```javascript
        app.use(cors({ origin: 'https://your-frontend-app.onrender.com' }));
        ```
        (Replace `https://your-frontend-app.onrender.com` with your actual frontend URL).

5.  **Deploy:** Save your changes and deploy the service. Render will automatically build and deploy your application.

(Instructions for Railway will be added here in a later step.)

## Contributing

Feel free to contribute to this project. Please follow the existing code style and submit pull requests.

## License

This project is licensed under the ISC License.
