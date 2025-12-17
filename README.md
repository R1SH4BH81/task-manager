# Task Manager Application

A full-stack task management application with real-time updates.

## Tech Stack

- **Frontend**: React + TypeScript + Vite with Tailwind CSS
- **Backend**: Node.js + Express with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: Socket.IO
- **Authentication**: JWT

## Docker Setup

This project includes Docker configuration for running the entire stack locally.

### Prerequisites

- Docker Desktop installed and running
- Docker Compose

### Running the Application

1. Clone the repository
2. Navigate to the project root directory
3. Run the following command:

```bash
docker-compose up --build
```

This will start all services:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Database: PostgreSQL on port 5432

### Screenshots
Dashboard
<img width="1525" height="780" alt="dashboard" src="https://github.com/user-attachments/assets/33485bf1-d0bb-4df2-9df2-a02ccf5c105c" />
Task List
<img width="1282" height="542" alt="task-list" src="https://github.com/user-attachments/assets/1f8d3915-e1c6-43af-9934-f336703c1549" />
Create Task 
<img width="881" height="811" alt="task-create" src="https://github.com/user-attachments/assets/ea4df0da-d693-44cd-9219-654e0b57ccb0" />

Login
<img width="897" height="773" alt="image" src="https://github.com/user-attachments/assets/b716574f-35ab-4337-a02a-225382ae9708" />
Register
<img width="773" height="705" alt="image" src="https://github.com/user-attachments/assets/38515e04-2e3a-4f13-8936-667584fe8321" />




### Services

1. **Frontend (React App)**

   - Built with Vite and served via Nginx
   - Accessible at http://localhost:3000

2. **Backend (Express API)**

   - REST API with real-time capabilities via Socket.IO
   - Accessible at http://localhost:5000

3. **Database (PostgreSQL)**
   - PostgreSQL database for storing users and tasks
   - Database name: taskmanager
   - User: postgres
   - Password: postgres

### Stopping the Application

To stop the application, press `Ctrl+C` in the terminal where docker-compose is running, or run:

```bash
docker-compose down
```

To stop and remove all volumes (including database data):

```bash
docker-compose down -v
```

## Manual Setup (Without Docker)

If you prefer to run the services manually:

### Backend

1. Navigate to the `server` directory
2. Install dependencies: `npm install`
3. Set up environment variables (copy `.env.example` to `.env` and fill in values)
4. Run database migrations: `npx prisma migrate dev`
5. Start the server: `npm run dev`

### Frontend

1. Navigate to the `client` directory
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Tasks

- `GET /api/tasks` - Get all tasks for the authenticated user
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Environment Variables

### Backend (.env)

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskmanager
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```
